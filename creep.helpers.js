var creepHelpers = {

    /** @param {Creep} creep **/
    moveToSource: function(creep) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {reusePath: 20});
            }
    }
}

module.exports = creepHelpers;