var roleScout = require('role.scout');
var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostile)
        {
            if (creep.attack(hostile) == ERR_NOT_IN_RANGE)
                creepHelper.moveCreep(creep, hostile);
        } 
        else
        {
            roleScout.run(creep);
        }
    }
};