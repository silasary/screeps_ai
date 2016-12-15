var buildPlan = 
{
    roads: function(){
        // var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        // if (sites.length){
        //     return false;
        // }
        for (var name in Game.creeps){
            var creep = Game.creeps[name];
            if (creep.memory.role == "builder"){
                continue;
            }
            var things = creep.pos.lookFor(LOOK_STRUCTURES)
            // console.log(things);
            if (things.length == 0){
                creep.pos.createConstructionSite(STRUCTURE_ROAD);
                return true;
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