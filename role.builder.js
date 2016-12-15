var creepHelper = require('creep.helpers');
var roleHarvester = require('role.harvester');
var buildPlan = require('buildplan');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {
                // Don't sit around doing nothing
                var res = buildPlan.roads();
                if (!res){
                    roleHarvester.run(creep);
                }
            }
        }
        else {
            creepHelper.moveToSourceOrContainer(creep);
        }
    }
};

module.exports = roleBuilder;