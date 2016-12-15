var creepHelper = require('creep.helpers');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('collecting');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('upgrading');
        }

        if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creepHelper.moveCreep(creep, creep.room.controller);
            }
        }
        else {
            creepHelper.moveToSourceOrContainer(creep);
        }
    }
};

module.exports = roleUpgrader;