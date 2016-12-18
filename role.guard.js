var roleScout = require('role.scout');
var creepHelper = require('creep.helpers');

module.exports = {
    run: function(creep) {
        var hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        // console.log(hostile);
        if (hostile)
        {
            let res = creep.attack(hostile);
            if (res == ERR_NOT_IN_RANGE)
            {
                let res = creepHelper.moveCreep(creep, hostile.pos);
                console.log(res);
            }
            else if (res != OK){
                // console.log(`error attacking ${res}`);
            }
            return;
        }
        hostile = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        if (hostile)
        {
            let res = creep.attack(hostile);
            if (res == ERR_NOT_IN_RANGE)
            {
                let res = creepHelper.moveCreep(creep, hostile.pos);
            }
            return;
        }
        hostile = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        if (hostile)
        {
            let res = creep.attack(hostile);
            if (res == ERR_NOT_IN_RANGE)
            {
                let res = creepHelper.moveCreep(creep, hostile.pos);
            }
            return;
        }

        roleScout.run(creep);

    }
};