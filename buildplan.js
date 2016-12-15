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

var buildPlan = 
{
    roads: function(){
        for (var name in Game.creeps){
            var creep = Game.creeps[name];
            if (creep.memory.role == "builder"){
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
        return false;
    }
}

module.exports = buildPlan;