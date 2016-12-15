var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleScout = require('role.scout');
var roleGuard = require('role.guard');
var spawner = require('spawner');

module.exports.loop = function () {
    spawner.run()

    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        require('tower').run(tower);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.ticksToLive < 200)
        {
            // var res = spawner.renew(creep);
            // if (res)
            // {
            //     continue;
            // }
        }
        if (creep.memory.renewing){
            spawner.renew(creep);
        }        
        else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if(creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
        else if(creep.memory.role == 'scout') {
            roleScout.run(creep);
        }
        else if(creep.memory.role == 'guard') {
            roleGuard.run(creep);
        }
    }
}