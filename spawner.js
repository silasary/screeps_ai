var roles = [
    {role: 'lodeBalancer', n:1},
    {role: 'harvester', n: 6}, 
    {role: 'builder',   fn:(spawn) => { return spawn.room.controller.level * 3; }},
    {role: 'upgrader',  n: 1},
    {role: 'repairer',  n: 1},
    {role: 'wallRepairer',  n:1},
    {role: 'longDistanceHarvester', n:4},
];

var spawnCreep = function(spawn, energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the given role
            return spawn.createCreep(body, undefined, { role: roleName, home: spawn.room.name });
        };

var spawnGuard = function(spawn){
    if (!spawn)
        return;
    if (spawn.spawning){
        return;
    }
    var energy = spawn.room.energyCapacityAvailable;
    if (energy < 200)
    {
        return;
    }
    if (spawn.room.find(FIND_HOSTILE_CREEPS).length > 0)
    {
        var name = spawn.createCreep([MOVE, MOVE, ATTACK], undefined, { role: "guard", home: spawn.room.name });
        console.log(`Spawning guard ${name}`);
        return name;
    }
}

var countCreeps = function(spawn){
    if (!spawn)
        return;
    for(var name in Memory.creeps) 
    {
        if(!Game.creeps[name]) 
        {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    var energy = spawn.room.energyAvailable;
    if (energy < 200)
    {
        return;
    }
    if (spawn.spawning){
        return;
    }

    for (var r in roles) {
        var role = roles[r];
        var existing = _.filter(Game.creeps, (creep) => creep.memory.role == role.role && creep.memory.home == spawn.room.name);
        //console.log(role.role + ": " + harvesters + "/" + role.n);
        var n = role.n;
        if (!n)
            n = role.fn(spawn);
        if(existing.length < n) {
            var newName = spawnCreep(spawn, energy, role.role);
            if (!(newName < 0)){
                console.log('Spawning new ' + role.role + ': ' + newName);
                return
            }
        }
    }
}

var spawnController = {

    run: function() 
    {
        var spawn = Game.spawns['Spawn1'];
        for (var spawn in Game.spawns){
            spawn = Game.spawns[spawn];
            spawnGuard(spawn);
            countCreeps(spawn);
        }
    },

    /** @param {Creep} creep **/
    renew: function(creep)
    {
        var spawn = Game.spawns['Spawn1'];
        if (!spawn)
            return;
        if (spawn.room.energyAvailable < spawn.room.energyCapacityAvailable)
        {
            return;
        }
        if (spawn.spawning){
            spawn.memory.renewing = false;
            creep.memory.renewing = false;
            return false;
        }
        if (spawn.memory.renewing && spawn.memory.renewing != creep.name)
        {
            creep.memory.renewing = false;
            return false;
        }
        if (!spawn.memory.renewing) {
            spawn.memory.renewing = creep.name;
            creep.memory.renewing = spawn.name;
            creep.say("renewing!")
        }
        var res = spawn.renewCreep(creep);
        if(res == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
        if (res == ERR_FULL || res == ERR_NOT_ENOUGH_ENERGY)
        {
            spawn.memory.renewing = false;
            creep.memory.renewing = false;
        }
        return true;
    },
    spawnScout: function(){
        var spawn = Game.spawns['Spawn1'];
        if (!spawn)
            return;
        return spawn.createCreep([MOVE, ATTACK, MOVE], undefined, { role: "scout", home: spawn.room.name });
    },
    spawnGuard: function(){ 
        for (var spawn of Game.spawns)
            spawnGuard(spawn);
    },

    spawnClaimer: function(room){
        var spawn = Game.spawns['Spawn1'];
        var newName = spawn.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: room });
        if (!(newName < 0))
            console.log(`Creating claimer ${newName} for ${room}`);
        return newName;
    },
}

module.exports = spawnController;