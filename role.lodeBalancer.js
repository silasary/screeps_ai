var creepHelper = require('creep.helpers');
var roleHarvester = require('role.harvester');

var roleLodeBalancer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.source = null;
            creep.say('collecting');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('depositing');
        }
        if (!creep.memory.working){
            
            if (!creep.memory.source){
                let containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > (structure.storeCapacity / 2);
                            }
                    }
                );
                var source = containers.sort((a,b) => {return b.store.energy - a.store.energy})[0];
                if (source)
                    creep.memory.source = source.id;
                else
                    roleHarvester.run(creep);
            }
            if (!creep.memory.source){
                let source = creepHelper.selectSource(creep);
                if (source)
                    creep.memory.source = source.id;
            }
            let res = creepHelper.harvestSource(Game.getObjectById(creep.memory.source));
            if (res != OK){
                // console.log(`Can't balance ${creep.memory.source}: ${res}`);
                roleHarvester.run(creep);                
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity)
                                || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity))
                                && structure.id != creep.memory.source;
                    }
            });
            if (targets.length > 0) {
                var closest = creep.pos.findClosestByRange(targets);
                if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
                return;
            }
            roleHarvester.run(creep);
        }
    }
};

module.exports = roleLodeBalancer;