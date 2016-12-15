var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        if (!creep.room.memory)
            creep.room.memory = {};

        if (creep.room.memory.lastScouted < Game.time - 1000)
        {
            creep.room.memory.lastScouted = Game.time;
            creep.room.memory.hasSource = creep.pos.findClosestByPath(FIND_SOURCES) == null;
        }
        if (creep.memory.target == creep.room.name){
            creep.memory.target = null;
        }
        if (!creep.memory.target){
            var exits = Game.map.describeExits(creep.room.name);
            var lastScouted = Game.time;
            var room = null;
            for (var dir in exits){
                if (!Memory.rooms[exits[dir]])
                {
                    lastScouted = 0;
                    room = exits[dir];
                }
                else if (Memory.rooms[exits[dir]].lastScouted < lastScouted)
                {
                    lastScouted = exits[dir].lastScouted;
                    room = exits[dir];
                }
            }
            creep.memory.target = room.name;
            creep.say('Now heading to room '+route[0].room);
        }
        var route = Game.map.findRoute(creep.room, creep.memory.target);
        if(route.length > 0) {
            var exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
        }
    }
};