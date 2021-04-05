'user strict';
var sql = require('../../db.js');
var sqlformat = require('sql-template-strings');
var assignChore = require('../chore-allocations/allocation.js');

//Chore object constructor
var Chore = function(chore) {
  this.title = chore.title;
  this.status = chore.status;
  this.effort_value = chore.effort_value;
  this.house_id = chore.house_id;
  this.goblin_id = chore.goblin_id;
};

Chore.createChore = function(newChore, result) {
  function insertChore(newChore, result) {
    sql.query("INSERT INTO chore (title, status, effort_value, house_id, goblin_id) VALUES (?, ?, ?, ?, ?)",
      [newChore.title, newChore.status, newChore.effort_value, newChore.house_id, newChore.goblin_id], function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {		  
        assignChore.allocateNewChore(newChore.house_id, res.insertId, result);
        //grabInsertedChore(res.insertId, result);
      }
    });
  }
  /*function grabInsertedChore(choreId, result) {
    sql.query("SELECT * FROM chore WHERE id = ? ", choreId, function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
		console.log("Here is the goblin id: ", res[0].goblin_id);
        result(null, res[0]);
      }
    });
  }*/

  insertChore(newChore, result);
};

Chore.getChoreById = function(choreId, result) {
  // sql.query(`SELECT * FROM chore WHERE id = ${id}`, function (err, res) {
  
  sql.query("SELECT * FROM chore WHERE id = ? ", choreId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      //console.log('chore: ', res);
      result(null, res[0]);

    }
  });
};

Chore.updateById = function(id, chore, result) {
  function grabUpdatedChore(choreId, result) {
    sql.query("SELECT * FROM chore WHERE id = ? ", choreId, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    });
  }
  sql.query("UPDATE chore SET title=?, status=?, effort_value=?, house_id=?, goblin_id=? WHERE id = ?", 
    [chore.title, chore.status, chore.effort_value, chore.house_id, chore.goblin_id, id], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      grabUpdatedChore(id, result);
    }
  });
};

Chore.remove = function(id, result) {
  sql.query("DELETE FROM chore WHERE id = ?", [id], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
};

Chore.getChoreListByHouseId = function(houseId, result) {
  //assignChore.rmAllChoreAllocations(houseId);
  //assignChore.assignAllChores(houseId, result, false);
  sql.query("SELECT * FROM chore WHERE house_id = ? ", houseId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      //console.log('chores: ', res);
      result(null, res);

    }
  });
};

Chore.completeChore = function(choreId, result) {
  
  function setChoreToCompleted(choreId, result) {
    sql.query("UPDATE chore SET status = ? WHERE id = ?", ['complete', choreId], function (err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, "chore completed");
      }
    });
  }
  function updateGoblinPoints(choreId, goblinId, newPoints, result) {
    sql.query("UPDATE goblin SET free_points = ? WHERE id = ?", [newPoints, goblinId], function (err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        setChoreToCompleted(choreId, result);
      }
    });
  }
  function grabGoblin(choreId, goblinId, chorePoints, result) {
    sql.query("SELECT * FROM goblin WHERE id = ?", goblinId, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        updateGoblinPoints(choreId, goblinId, chorePoints + res[0].free_points, result);
      }
    });
  }
  sql.query("SELECT * FROM chore WHERE id = ? ", choreId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      grabGoblin(choreId, res[0].goblin_id, res[0].effort_value, result);
    }
  });
}

Chore.getChoreHistoryListByWeekId = function(weekId, result) {
  sql.query("SELECT * FROM chore_history WHERE week_id = ? ", weekId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      //console.log('chores: ', res);
      result(null, res);
    }
  });
}

module.exports = Chore;