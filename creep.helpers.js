
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
var selectSource = function(creep){
    var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter: (source) => {return source.energy > 0;}});
    return source;
}

var harvestSource = function(creep, source){
    if (!source)
        return ERR_INVALID_ARGS;
    if (typeof(source) == 'string')
        source = Game.getObjectById(source);
    if (!source)
        return ERR_INVALID_ARGS;
    if (source.structureType)
    {
        let res = creep.withdraw(source, RESOURCE_ENERGY);
        if(res == ERR_NOT_IN_RANGE) {
            return MoveCreep(creep, source);
        };
        // console.log(`withdraw: ${res}`);
        return res;
    }
    else
    {
        let res = creep.harvest(source);
        if(res == ERR_NOT_IN_RANGE) {
            return MoveCreep(creep, source);
        };
        // console.log(`harvest: ${res}`);
        return res;
    }
}

/** @param {Creep} creep **/
var moveToSource = function(creep) {
    var source = selectSource(creep);
    return harvestSource(creep, source);
};

var collectDroppedEnergy = function() {
    var dropped = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (dropped)
    {
        if(creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            var ret = creepHelper.moveCreep(creep, dropped);
            if (ret == OK)
            {
                // creep.say("Picking up dropped energy!")
                return true;
            }
        }
    }
    return false;
}

var exitRoom = function(creep, destination){
    var route = Game.map.findRoute(creep.room, destination);
    if(route.length > 0) {
        var exit = creep.pos.findClosestByRange(route[0].exit);
        creep.moveTo(exit);
    }
}

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
    moveToSourceOrContainer: moveToSourceOrContainer,
    exitRoom: exitRoom,
    selectSource: selectSource,
    harvestSource: harvestSource,
}

module.exports = creepHelpers;