module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if in target room
        if (creep.room.name != creep.memory.target) {
            // find exit to target room
            var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(creep.pos.findClosestByRange(exit));
        }
        else if (creep.room.controller.level > 0){
            creep.memory.role = "scout";
        }
        else {
            // try to claim controller
            let res = creep.claimController(creep.room.controller);
            if (res == ERR_GCL_NOT_ENOUGH)
            {
                res = creep.reserveController(creep.room.controller);
            }
            if (res == ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
    }
};