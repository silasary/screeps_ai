/** @param {Creep} creep **/
var MoveCreep = function(creep, target){
    return creep.moveTo(target, {reusePath: 20})
}

/** @param {Creep} creep **/
var moveToSource = function(creep) {
    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        return MoveCreep(creep, source);
    };
};

/** @param {Creep} creep **/
var moveToSourceOrContainer = function(creep) {
    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] > 0
    });
    if (container != undefined) {
        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            return MoveCreep(creep, container);
        }
    }
    else {
        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            MoveCreep(creep, source);
        }
    }
};

var creepHelpers = {
    moveCreep: MoveCreep,
    moveToSource: moveToSource,
    moveToSourceOrContainer: moveToSourceOrContainer
}

module.exports = creepHelpers;