var controller = {

    run: function() {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if (Game.spawns['Spawn1'].spawning){
        return;
    }

    roles = [
        {role: 'harvester', n: 2}, 
        {role: 'builder', n:3},
        {role: 'upgrader', n:1}
        ];
    for (var r in roles) {
        role = roles[r];
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role.role);
        //console.log(role.role + ": " + harvesters + "/" + role.n);

        if(harvesters.length < role.n) {
            var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: role.role});
            console.log('Spawning new harvester: ' + newName);
        }
    }
    }
}

module.exports = controller;