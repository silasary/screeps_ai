// This is nasty. Do it smarter.
function getRandomFreePos(startPos, distance) {
    var x,y;
    do {
        x = startPos.x + Math.floor(Math.random()*(distance*2+1)) - distance;
        y = startPos.y + Math.floor(Math.random()*(distance*2+1)) - distance;
    }
    while((x+y)%2 != (startPos.x+startPos.y)%2 || Game.map.getTerrainAt(x,y,startPos.roomName) == 'wall');
    return new RoomPosition(x,y,startPos.roomName);
}

function build(spawn, structureType) {
    var structures = spawn.room.find(FIND_STRUCTURES, {filter: {structureType, my: true}});
    for(var i=0; i < CONTROLLER_STRUCTURES[structureType][spawn.room.controller.level] - structures.length; i++) {
        getRandomFreePos(spawn.pos, 5).createConstructionSite(structureType);
    }
}

var buildPlan = 
{
    all: function() {
        buildPlan.roads();
        buildPlan.extensions();
        buildPlan.spawns();
    },
    roads: function(){
        for (var name in Game.creeps){
            var creep = Game.creeps[name];
            if (creep.memory.role == "builder" || creep.memory.role == "wallRepairer"){
                continue;
            }
            var things = creep.pos.lookFor(LOOK_STRUCTURES)
            // console.log(things);
            if (things.length == 0){
                creep.pos.createConstructionSite(STRUCTURE_ROAD);
                console.log("Building a road at " + creep.pos.x, "," + creep.pos.y);
                // return true;
            }
            else{
                for (var t in things){
                    // console.log(t.structureType)
                }
            }
        }
    },

    extensions: function(){
        for (var name in Game.spawns)
        {
            spawn = Game.spawns[name];
            build(spawn, STRUCTURE_EXTENSION);
        }
    },

    spawns: function(){
        for (var room in Game.rooms){
            build(Game.rooms[room].controller, STRUCTURE_SPAWN);
        }
    }
}

module.exports = buildPlan;