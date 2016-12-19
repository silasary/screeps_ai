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
        if (creep.pos.y == 0)
            creep.move(BOTTOM);
        else if (creep.pos.x == 0)
            creep.move(RIGHT);
        else if (creep.pos.y == 49)
            creep.move(TOP);
        else if (creep.pos.x == 49)
            creep.move(LEFT);
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