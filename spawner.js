var roles = [
    {role: 'harvester', n: 2}, 
    {role: 'builder', n:3},
    {role: 'upgrader', n:1}
    ];

var spawnController = {

    run: function() 
    {
        for(var name in Memory.creeps) 
        {
            if(!Game.creeps[name]) 
            {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        if (Game.spawns['Spawn1'].spawning){
            return;
        }

        for (var r in roles) {
            var role = roles[r];
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
            //console.log(role.role + ": " + harvesters + "/" + role.n);

            if(harvesters.length < role.n) {
                var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: role.role});
                if (!(newName < 0)){
                    console.log('Spawning new ' + role.role + ': ' + newName);
                    return
                }
            }
        }
    },

    /** @param {Creep} creep **/
    renew: function(creep)
    {
        var spawn = Game.spawns['Spawn1'];
        if (spawn.spawning){
            spawn.memory.renewing = false;
            creep.memory.renewing = false;
            return false;
        }
        if (spawn.memory.renewing && spawn.memory.renewing != creep)
        {
            creep.memory.renewing = false;
            return false;
        }
        spawn.memory.renewing = creep;
        creep.memory.renewing = spawn;
        var res = spawn.renewCreep(creep);
        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
        if (res == ERR_FULL)
        {
            spawn.memory.renewing = false;
            creep.memory.renewing = false;
        }
    }
}

module.exports = spawnController;