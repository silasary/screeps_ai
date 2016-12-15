
var getPath= function(pos, target){
    var room = Game.rooms[pos.roomName];
    if (!room.memory)
        room.memory = {};
    if (!room.memory.pathing)
        room.memory.pathing = {};
    var key = `${target.id},${pos.x},${pos.y}`
    if (!room.memory.pathing[key] || room.memory.pathing[key].expires < Game.time)
    {
        var route = room.findPath(pos, target.pos, {ignoreCreeps: true, ignoreRoads: true, serialize: true});
        room.memory.pathing[key] = {
            expires: Game.time + 200,
            route: route
        };
    }
    return Room.deserializePath(room.memory.pathing[key].route);
}

/** @param {Creep} creep **/
var MoveCreep = function(creep, target){
    // path = getPath(creep.pos, target);
    // var res = creep.moveByPath(path);
    // if (res == ERR_NOT_FOUND)
    //     return creep.moveTo(target, {reusePath: 20})
    // else
    //     return res;
    return creep.moveTo(target, {reusePath: 20})
}

/** @param {Creep} creep **/
var moveToSource = function(creep) {
    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (source){
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            return MoveCreep(creep, source);
        };
    }
    else
    {
        
    }
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
        moveToSource(creep);
    }
};

var creepHelpers = {
    moveCreep: MoveCreep,
    moveToSource: moveToSource,
    moveToSourceOrContainer: moveToSourceOrContainer
}

module.exports = creepHelpers;