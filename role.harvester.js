var creepHelper = require('creep.helpers');
var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (dropped)
            {
                if(creep.pickup(dropped[0]) == ERR_NOT_IN_RANGE) {
                    var ret = creepHelper.MoveCreep(creep, dropped);
                    if (ret == OK)
                    {
                        creep.say("Picking up dropped energy!")
                        return;
                    }
                };
            }
            creepHelper.moveToSource(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                closest = creep.pos.findClosestByRange(targets);
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
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
                         && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                return;
            }
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleHarvester;