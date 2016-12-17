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
                            return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > structure.storeCapacity;
                            }
                    }
                );
                creep.memory.source = _.orderBy(containers, ['store.energy'], ['desc'])[0];
            }
            if (!creep.memory.source){
                creep.memory.source = creepHelper.selectSource(creep);
            }
            creepHelper.harvestSource(creep.memory.source);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity)
                                || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity))
                                && structure != creep.memory.source;
                    }
            });
            if(targets.length > 0) {
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