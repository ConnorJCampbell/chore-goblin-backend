'user strict';
var sql = require('../../db.js');
var sqlformat = require('sql-template-strings');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var logger = require('../../logger.js');

function makeHouseCode(length) {
   var result           = '';
   var characters       = 'abcdefghijkmnpqrstuvwxyz23456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

//House object constructor
var House = function(house) {
  this.name = house.name;
  this.code = house.code;
  this.battle_interval = house.battle_interval;
  this.password = house.password;
};
House.createHouse = function(newHouse, result) {
  newHouse.code = '';
  newHouse.battle_interval = 0;
  function checkIfHouseCodeExists (thisFunction, makeHouseQuery, newHouse, result) {
    var tempCode = makeHouseCode(6);
    sql.query("SELECT * FROM house WHERE code = ? ", tempCode, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        //console.log("result is" + res);
        if (res.length > 1) {
          thisFunction(thisFunction, makeHouseQuery, newHouse, result);
        } else if (res.length == 0) {
          //console.log("tempCode is " + tempCode);
          //console.log("res is " + result);
          newHouse.code = tempCode;
          makeHouseQuery(newHouse, result);
        }
      }
    });
  }

  function makingHouseQuery(newHouse, result) {
    if (!newHouse.password) {
      newHouse.hashed_password = null;
    } else {
      //console.log('hashing password ' + newHouse.password);
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync(newHouse.password, salt);
      newHouse.hashed_password = hash;
    }
    sql.query("INSERT INTO house (code, name, battle_interval, hashed_password) VALUES (?, ?, ?, ?)", [newHouse.code, newHouse.name, newHouse.battle_interval, newHouse.hashed_password], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      grabInsertedHouse(res.insertId, result);
    }});
  }

  function grabInsertedHouse(houseId, result) {
    sql.query("SELECT id, code, name, battle_interval FROM house WHERE id = ? ", houseId, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    });
  }

  checkIfHouseCodeExists(checkIfHouseCodeExists, makingHouseQuery, newHouse, result);
};
House.getHouseByCode = function(houseCode, password, result) {
  sql.query("SELECT id, code, name, battle_interval, hashed_password FROM house WHERE code = ? ", houseCode, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      if (res.length == 0) {
        result("house not found", null);
      } else {
        if (!res[0].hashed_password) {
          //console.log('house: ', res);
          delete res[0].hashed_password;
          result(null, res[0]);
        } else {
          //console.log("comparing " + password + " to " + res[0].hashed_password);
          if (!password) {
            logger.logError('no password given for secured house');
            result("no password given for secured house", null);
          } else {
            if (bcrypt.compareSync(password, res[0].hashed_password)) {
              delete res[0].hashed_password;
              result(null, res[0]);
            } else {
              result("incorrect password", null);
            }
          }
        }
      }
    }
  });
};
House.updateById = function(code, house, result) {
  function grabUpdatedHouse(houseCode, result) {
    sql.query("SELECT code, name, battle_interval FROM house WHERE code = ? ", houseCode, function(err, res) {
      if (err) {
        logger.logError(err);
        console.log("error: ", err);
        result(err, null);
      } else {
        result(null, res[0]);
      }
    });
  }
  sql.query("UPDATE house SET name = ?, battle_interval = ? WHERE code = ?", [house.name, house.battle_interval, code], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      grabUpdatedHouse(code, result);
    }
  });
};
House.remove = function(code, result) {
  sql.query("DELETE FROM house WHERE code = ?", [code], function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });

};

House.getWeekHistoryByHouseId = function(houseId, result) {
  sql.query("SELECT * FROM week_history WHERE house_id = ?", houseId, function(err, res) {
    if (err) {
      logger.logError(err);
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res);
    }
  });
}

module.exports = House;
