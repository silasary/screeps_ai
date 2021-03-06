var creepHelper = require('creep.helpers');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('collecting');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('depositing');
        }
        if (!creep.memory.working){
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if (dropped)
            {
                if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
                    var ret = creepHelper.moveCreep(creep, dropped);
                    if (ret == OK)
                    {
                        // creep.say("Picking up dropped energy!")
                        return;
                    }
                    else
                        console.log(ret);
                }
            }
            creepHelper.moveToSource(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) 
                            || (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                    }
            });
            if(targets.length > 0) {
                var closest = creep.pos.findClosestByRange(targets);
                if(creep.transfer(closest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closest);
                }
                return;
            }
            targets = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER)
                         && structure.energy < structure.storeCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }
            if (creep.room.name != creep.memory.home){
                creepHelper.exitRoom(creep, creep.memory.home);
            }
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleHarvester;