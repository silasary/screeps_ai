var roleBuilder = require('role.builder');
var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('collecting');
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('repairing');
        }

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });

            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creepHelper.moveCreep(creep, structure);
                }
            }
            else {
                    roleBuilder.run(creep);
            }
        }
        else {
            creepHelper.moveToSourceOrContainer(creep);
        }
    }
};