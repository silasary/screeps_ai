var roleScout = require('role.scout');
var roleUpgrader = require('role.upgrader');
var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        if (creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            if (creep.room.name == creep.memory.home) {
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                 || s.structureType == STRUCTURE_EXTENSION
                                 || s.structureType == STRUCTURE_TOWER)
                                 && s.energy < s.energyCapacity
                });

                if (structure == undefined) {
                    structure = creep.room.storage;
                }

                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                }

                if (structure == undefined){
                    roleUpgrader.run(creep);
                }
            }
            else {
                creepHelper.exitRoom(creep, creep.memory.home);
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            if (!creep.memory.target){
                roleScout.run(creep);
                if (creep.room.id == creep.memory.home)
                    return;
                if (creep.room.controller){
                    if (creep.room.controller.level > 0)
                        return; // Claimed.
                    if (creep.room.controller.reservation && creep.room.controller.reservation.username != creep.owner.username)
                        return;
                    if (!creep.room.controller.reservation)
                        require('spawner').spawnClaimer(creep.room.name);
                }
                if (creep.room.memory.hasSource > 0)
                {
                    let source = creepHelper.selectSource(creep);
                    if (source)
                    {
                        creep.memory.source = source.id;
                    }
                    else
                        return;
                    creep.memory.target = creep.room.name;
                    delete creep.memory.destination;
                    creep.say("Using this room.");
                    return;
                }
                else
                    return;
            }
            if (creep.memory.source)
            {
                let ret = creepHelper.harvestSource(creep, creep.memory.source);
                if (ret == OK)
                    return ret;
                if (ret == ERR_INVALID_ARGS)
                {
                    // Not in the right room.
                }
                else 
                {
                    console.log(`${creep.name} failed to go to ${creep.memory.source}: ${ret}`);
                }
            }
            if (creep.room.name == creep.memory.target) {
                creepHelper.moveToSource(creep);
            }
            else {
                creepHelper.exitRoom(creep, creep.memory.target);
            }
        }
    }
};