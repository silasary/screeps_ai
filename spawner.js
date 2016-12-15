var roles = [
    {role: 'harvester', n: 4}, 
    {role: 'builder',   n:1},
    {role: 'upgrader',  n:1},
    {role: 'repairer',  n:1},
    {role: 'wallRepairer',  n:1},
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
    if (spawn.room.find(FIND_HOSTILE_CREEPS).length > 0)
    {
        var name = spawn.createCreep([ATTACK, MOVE, MOVE], undefined, { role: "guard", home: spawn.room.name });
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
    var energy = spawn.room.energyCapacityAvailable;
    if (energy < 200)
    {
        return;
    }
    if (spawn.spawning){
        return;
    }

    for (var r in roles) {
        var role = roles[r];
        var existing = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
        //console.log(role.role + ": " + harvesters + "/" + role.n);

        if(existing.length < role.n) {
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
        // for (var spawn of Game.spawns){
            spawnGuard(spawn);
            countCreeps(spawn);
    },

    /** @param {Creep} creep **/
    renew: function(creep)
    {
        var spawn = Game.spawns['Spawn1'];
        if (!spawn)
            return;
        var energy = spawn.room.energyCapacityAvailable;
        if (energy < 200)
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
    }
}

module.exports = spawnController;