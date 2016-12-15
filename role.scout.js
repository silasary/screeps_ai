var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        if (!creep.room.memory)
        {
            creep.room.memory = {};
        }
        creep.room.memory.lastScouted = Game.time;
        creep.room.memory.hasSource = creep.pos.findClosestByPath(FIND_SOURCES) == null;
        var destination = creep.memory.destination;
        if (destination == creep.room.name){
            creep.memory.destination = null;
            destination = null;
        }
        if (!destination){
            var exits = Game.map.describeExits(creep.room.name);
            var lastScouted = Game.time;
            var room = null;
            for (var dir in exits){
                if (Memory.rooms[exits[dir]] == undefined)
                {
                    lastScouted = 1;
                    room = exits[dir];
                }
                else if (Memory.rooms[exits[dir]].lastScouted < lastScouted)
                {
                    lastScouted = exits[dir].lastScouted;
                    room = exits[dir];
                }
            }
            destination = room;
            creep.memory.destination = destination;
            creep.say('Scouting '+destination);
            console.log(`${creep.name} scouting ${destination}`);
        }
        var route = Game.map.findRoute(creep.room, destination);
        if(route.length > 0) {
            var exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        }
    }
};