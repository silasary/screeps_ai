var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        if (!creep.room.memory)
        {
            creep.room.memory = {};
        }
        creep.room.memory.lastScouted = Game.time;
        creep.room.memory.hasSource = creep.room.find(FIND_SOURCES).length;
        var destination = creep.memory.destination;
        if (destination == creep.room.name){
            creep.memory.destination = null;
            destination = null;
            if (creep.pos.y == 0)
                creep.move(BOTTOM);
            else if (creep.pos.x == 0)
                creep.move(RIGHT);
            else if (creep.pos.y == 49)
                creep.move(TOP);
            else if (creep.pos.x == 49)
                creep.move(LEFT);
            return;
        }
        if (!destination){
            var exits = Game.map.describeExits(creep.room.name);
            var lastScouted = Game.time;
            var room = null;
            for (var dir in exits){
                console.log(lastScouted);
                console.log(room);
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
        // var exitdir = Game.map.findExit(creep.room, destination);
        // if(exitdir) {
        //     var exit = creep.pos.findClosestByRange(exit);
        //     creep.moveTo(exit);
        // }
        // else
        // {
        creepHelper.exitRoom(creep, destination);
        // }
    }
};