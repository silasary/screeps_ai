var buildPlan = 
{
    roads: function(){
        var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (sites.length){
            return false;
        }
        for (var name in Game.creeps){
            var creep = Game.creeps[name];
            if (creep.memory.role == "builder"){
                continue;
            }
            var things = creep.pos.lookFor(LOOK_STRUCTURES)
            if (!things){
                creep.pos.createConstructionSite(STRUCTURE_ROAD);
                return true;
            }
        }
    }
}

module.exports = buildPlan;