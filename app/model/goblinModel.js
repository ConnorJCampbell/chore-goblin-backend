'user strict';
var sql = require('../../db.js');
var sqlformat = require('sql-template-strings');
var logger = require('../../logger.js');
var assignChore = require('../chore-allocations/allocation.js');

//Goblin object constructor
var Goblin = function(goblin) {
  this.goblin_name = goblin.goblin_name;
  this.owner_name = goblin.owner_name;
  this.house_id = goblin.house_id;
  this.hp = goblin.hp;
  this.strength = goblin.strength;
  this.defense = goblin.defense;
  this.speed = goblin.speed;
  this.appearance = goblin.appearance;
  this.free_points = goblin.free_points;
};

Goblin.createGoblin = function(newGoblin, result) {
  function insertGoblin(newGoblin, result) {
    sql.query("INSERT INTO goblin (owner_name, goblin_name, hp, strength, defense, speed, appearance, house_id, free_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newGoblin.owner_name, newGoblin.goblin_name, newGoblin.hp, newGoblin.strength, newGoblin.defense, newGoblin.speed, newGoblin.appearance, newGoblin.house_id, newGoblin.free_points], function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        grabInsertedGoblin(res.insertId, result);
      }
    });
  }
  function grabInsertedGoblin(goblinId, result) {
    sql.query("SELECT * FROM goblin WHERE id = ? ", goblinId, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    });
  }

  insertGoblin(newGoblin, result);
};

Goblin.getGoblinById = function(goblinId, result) {
  // sql.query(`SELECT * FROM goblin WHERE id = ${id}`, function (err, res) {

  sql.query("SELECT * FROM goblin WHERE id = ? ", goblinId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      //console.log('goblin: ', res);
      result(null, res[0]);

    }
  });
};
Goblin.updateById = function(id, goblin, result) {
  function grabUpdatedGoblin(goblinId, result) {
    sql.query("SELECT * FROM goblin WHERE id = ? ", goblinId, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    });
  }
  sql.query("UPDATE goblin SET owner_name=?, goblin_name=?, hp=?, strength=?, defense=?, speed=?, appearance=?, free_points=? WHERE id = ?", 
    [goblin.owner_name, goblin.goblin_name, goblin.hp, goblin.strength, goblin.defense, goblin.speed, goblin.appearance, goblin.free_points, id], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      grabUpdatedGoblin(id, result);
    }
  });
};

Goblin.remove = function(id, result) {
  //step 3: remove the goblin
  function removeGoblin(houseId, goblinId, result) {
    sql.query("DELETE FROM goblin WHERE id = ?", [id], function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        //Step 4: once the goblin has been removed, reaasign all the chores
        assignChore.assignAllChores(houseId, function() {
          result(null, res);
        });
      }
    });
  }
  //Step 2: get the house id
  function getHouseId(goblinId, result) {
    sql.query("SELECT house_id FROM goblin WHERE id = ?", [goblinId], function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        removeGoblin(res[0].house_id, goblinId, result);
      }
    });
  }
  //Step 1: update all the chores that are assigned to the goblin to null
  sql.query("UPDATE chore SET goblin_id = null WHERE goblin_id = ?", [id], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      getHouseId(id, result);
    }
  });
};

Goblin.getGoblinListByHouseId = function(houseId, result) {
  sql.query("SELECT * FROM goblin WHERE house_id = ? ", houseId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      //console.log('goblins: ', res);
      result(null, res);

    }
  });
};

module.exports = Goblin;