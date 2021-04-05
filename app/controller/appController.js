'use strict';

var House = require('../model/houseModel.js');
var Goblin = require('../model/goblinModel.js');
var Chore = require('../model/choreModel.js');
var ChoreUpdate = require('../model/choreModel.js');
var goblinFight = require('../lib/goblinFight.js');
var fs = require('fs');
const path = require("path");
var logger = require('../../logger.js');

//House Functions
exports.create_a_house = function(req, res) {
    logger.logAPIReq('create_a_house', req.body);
    var new_house = new House(req.body);
    if (!new_house.name) {
        logger.logError('Please provide house name');
        res.status(400).send({
            error: true,
            message: 'Please provide house name'
        });
    } else {
        House.createHouse(new_house, function(err, house) {
            if (err)
                res.send(err);
            else
                res.json(house);
        });
    }
};


exports.read_a_house = function(req, res) {
    logger.logAPIReq('read_a_house', req.body);
    House.getHouseByCode(req.params.houseCode, req.body.password, function(err, house) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(house);
    });
};

exports.update_a_house = function(req, res) {
    logger.logAPIReq('update_a_house', req.body);
    House.updateById(req.params.houseCode, new House(req.body), function(err, house) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(house);
    });
};

exports.delete_a_house = function(req, res) {
    logger.logAPIReq('delete_a_house', req.body);
    House.remove(req.params.houseCode, function(err, house) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json({
                message: 'House successfully deleted'
            });
    });
};

//Goblin Functions
exports.create_a_goblin = function(req, res) {
    logger.logAPIReq('create_a_goblin', req.body);
    var new_goblin = new Goblin(req.body);
	new_goblin.hp 			= 10;
	new_goblin.strength 	= 1;
	new_goblin.defense		= 1;
	new_goblin.speed 		= 1;
	new_goblin.appearance	= "";
	new_goblin.free_points 	= 0;
	
    if (!new_goblin.owner_name || !new_goblin.goblin_name || !new_goblin.house_id) {
        logger.logError('Missing one of the following: goblin_name, owner_name, house_id');
        res.status(400).send({
            error: true,
            message: 'Please provide goblin_name, owner_name, house_id'
        });
    } else {
        Goblin.createGoblin(new_goblin, function(err, goblin) {
            if (err) {
                logger.logError(err);
		res.send(err);
	    }
            else
                res.json(goblin);
        });
    }
};

exports.read_a_goblin = function(req, res) {
    logger.logAPIReq('read_a_goblin', req.body);
    Goblin.getGoblinById(req.params.goblinId, function(err, goblin) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(goblin);
    });
};

exports.update_a_goblin = function(req, res) {
    logger.logAPIReq('update_a_goblin', req.body);
    Goblin.updateById(req.params.goblinId, new Goblin(req.body), function(err, goblin) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(goblin);
    });
};

exports.delete_a_goblin = function(req, res) {
    logger.logAPIReq('delete_a_goblin', req.body);
    Goblin.remove(req.params.goblinId, function(err, goblin) {
        if (err) {
            logger.logError(err);
            res.send(err);
        }
        else {
            res.json({
                message: 'Goblin successfully deleted'
            });
        }
    });
};

exports.read_goblin_list = function(req, res) {
    logger.logAPIReq('read_goblin_list', req.body);
    Goblin.getGoblinListByHouseId(req.params.houseId, function(err, goblin) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(goblin);
    });
};

//Chore Functions
exports.create_a_chore = function(req, res) {
    logger.logAPIReq('create_a_chore', req.body);
    var new_chore = new Chore(req.body);
	new_chore.status 	= "incomplete";
	new_chore.goblin_id = null
    if (!new_chore.title || !new_chore.house_id || !new_chore.effort_value) {
        logger.logError('Missing one of the following: title, house_id, effort_value');
        res.status(400).send({
            error: true,
            message: 'Please provide title, house_id, effort_value'
        });
    } else {
        Chore.createChore(new_chore, function(err, chore) {
            if (err){
                logger.logError(err);
		res.send(err);
	    }
            else
                res.json(chore);
        });
    }
};

exports.read_a_chore = function(req, res) {
    logger.logAPIReq('read_a_chore', req.body);
    Chore.getChoreById(req.params.choreId, function(err, chore) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(chore);
    });
};

exports.update_a_chore = function(req, res) {
    logger.logAPIReq('update_a_chore', req.body);
    Chore.updateById(req.params.choreId, new Chore(req.body), function(err, chore) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(chore);
    });
};

exports.delete_a_chore = function(req, res) {
    logger.logAPIReq('delete_a_chore', req.body);
    Chore.remove(req.params.choreId, function(err, chore) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json({
                message: 'Chore successfully deleted'
            });
    });
};

exports.read_chore_list = function(req, res) {
    logger.logAPIReq('read_chore_list', req.body);
    Chore.getChoreListByHouseId(req.params.houseId, function(err, chore) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(chore);
    });
};

exports.goblin_fight = function(req, res) {
    logger.logAPIReq('goblin_fight', req.body);
    if (isNaN(req.params.houseId)) {
        logger.logError('NaN house code sent for goblin fight');
        res.send('you fucking donkey this house code is horseshit');
    }
    var fileName = path.join(__dirname+'../../../goblinFightResults/' + req.params.houseId + '_fight.json');
    if (fs.existsSync(fileName)) {
        res.sendFile(fileName);
    } else {
        logger.logError('No fight exists for this house fight: ' + fileName);
        res.send('you fucking donkey there\'s no goblin fight for this house code, the filename is ' + fileName);
    }
}


exports.complete_a_chore = function(req, res) {
    logger.logAPIReq('complete_a_chore', req.body);
    Chore.completeChore(req.params.choreId, function(err, chore) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(chore);
    })
}

exports.read_week_list = function(req, res) {
    logger.logAPIReq('read_week_list', req.body);
    if (isNaN(req.params.houseId)) {
        logger.logError('NaN house id sent for week list');
        res.send('you fucking donkey this house id is horseshit');
    } else {
        House.getWeekHistoryByHouseId(req.params.houseId, function(err, weekList) {
            if (err) { logger.logError(err); res.send(err); }
            else
                res.json(weekList);
        })
    }
}

exports.read_chore_history_list = function(req, res) {
    logger.logAPIReq('read_chore_history_list', req.body);
    Chore.getChoreHistoryListByWeekId(req.params.weekId, function(err, chore) {
        if (err) { logger.logError(err); res.send(err); }
        else
            res.json(chore);
    });
};

exports.goblin_fight_history = function(req, res) {
    logger.logAPIReq('goblin_fight_history', req.body);
    if (isNaN(req.params.weekId)) {
        logger.logError('NaN week id sent for goblin fight history');
        res.send('you fucking donkey this week id is horseshit');
    }
    var fileName = path.join(__dirname+'../../../goblinFightHistory/' + req.params.weekId + '_fight.json');
    if (fs.existsSync(fileName)) {
        res.sendFile(fileName);
    } else {
        logger.logError('No fight exists for this week fight: ' + fileName);
        res.send('(probably because this is the first week) you fucking donkey there\'s no goblin fight for this week id, the filename is ' + fileName);
    }
}
