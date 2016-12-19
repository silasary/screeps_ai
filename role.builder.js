var creepHelper = require('creep.helpers');
var roleHarvester = require('role.lodeBalancer');
var buildPlan = require('buildplan');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.say('collecting');
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('building');
        }

        if(creep.memory.working) {
            var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creepHelper.moveCreep(creep, target);
                }
            }
            else
            {
                for (var room in Game.rooms){
                    room = Game.rooms[room];
                    let sites = room.find(FIND_CONSTRUCTION_SITES, {filter: (site) => {site.owner.name == creep.owner.name}});
                    if (sites)
                    {
                        return creepHelper.exitRoom(creep, room.name);
                    } 
                }
                // Don't sit around doing nothing
                var res = buildPlan.roads();
                buildPlan.extensions();
                buildPlan.spawns();
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