var roleBuilder = require('role.builder');
var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL
            });

            var target = undefined;

            // loop with increasing percentages
            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                // find a wall with less than percentage hits
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break;
                    }
                }

                if (target != undefined) {
                    break;
                }
            }

            // if we find a wall that has to be repaired
            if (target != undefined) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creepHelper.moveCreep(creep, target);
                }
            }
            else {
                // look for construction sites
                roleBuilder.run(creep);
            }
        }
        else {
            creepHelper.moveToSourceOrContainer(creep);
        }
    }
};