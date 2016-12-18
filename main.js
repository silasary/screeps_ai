var spawner = require('spawner');

module.exports.loop = function () {
    spawner.run();

    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        require('tower').run(tower);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.fatigue > 0)
            continue;
        if (creep.ticksToLive < 200)
        {
            var res = spawner.renew(creep);
            if (res)
            {
                continue;
            }
        }
        if (creep.memory.renewing){
            spawner.renew(creep);
        }        
        else 
        {
            require(`role.${creep.memory.role}`).run(creep);
        }
    }
}