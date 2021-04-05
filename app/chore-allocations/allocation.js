'use strict';

const sql = require('../../db.js');
var async = require('async');

exports.assignAllChores = function(houseId, result) {

  sql.query("SELECT id FROM chore WHERE goblin_id IS NULL AND house_id = ?", houseId, function(err, res) {
    if (err)
    {
      console.log("error: ", err);
      result(err, null);
    }
    else
    {
      //randomize list of chores
      res = shuffle(res);
      async.forEachOfSeries(res, function(chore, index, callback) {
        sql.query("SELECT id FROM goblin WHERE house_id = ? AND " + 
          "NOT EXISTS(SELECT null FROM chore " +
          "WHERE chore.house_id = ? AND goblin_id = goblin.id " +
          "GROUP BY goblin_id)", [houseId, houseId], function(err2, res2) {
          if (err2)
          {
            console.log("error: ", err2);
            callback(err2, null);
          }
          else
          {
            //if there are people in the house with no assigned chores, assign this to one of them
            if(res2.length > 0)
            {
              //console.log("Entering loop 1.");
              res2 = shuffle(res2);
              assignToGoblin(res2[0].id, chore.id, callback);
            }
            //else assign to house member with the lowest effort_value
            else
            {
              //console.log("Entering loop 2.");
              assignToLazyGoblin(houseId, chore.id, callback);
            }
          }
        });
      },
      function(err) {
        if( err ) {
          console.log("Error");
          result();
        } 
        else {
          console.log("The chore list has probably been reassigned.");
          result();
        }
      });
    }
  });
};

exports.rmAllChoreAllocations = function(houseId, result) {
  sql.query("UPDATE chore SET goblin_id = null, status = 'incomplete' WHERE house_id = ? AND status = 'complete'", houseId, function(err, res) {
    if (err)
    {
      console.log("error: ", err);
      result(err, null);
    }
    else
    {
      console.log("The chore list has been reset for house id ", houseId);
      result();
    }
  });
};

exports.allocateNewChore = function(houseId, choreId, result) {
	sql.query("SELECT id FROM goblin WHERE house_id = ? AND " + 
		"NOT EXISTS(SELECT null FROM chore " +
		"WHERE chore.house_id = ? AND goblin_id = goblin.id " +
		"GROUP BY goblin_id)", [houseId, houseId], function(err, res) {
	  if (err)
	  {
      console.log("error: ", err);
      result(err, null);
    }
	  else
	  {
      //if there are people in the house with no assigned chores, assign this to one of them
      if(res.length > 0)
      {
        //console.log("Entering loop 1.");
        res = shuffle(res);
        assignToGoblin(res[0].id, choreId, result);
      }
      //else assign to house member with the lowest effort_value
      else
      {
        //console.log("Entering loop 2.");
        assignToLazyGoblin(houseId, choreId, result);
      }
    }
  });
};

function assignToGoblin(goblinId, choreId, result) {
  sql.query("UPDATE chore SET goblin_id = ? WHERE id = ?", [goblinId, choreId], function(err, res) {
    if (err)
    {
      console.log("error: ", err);
      result(err, null);
    }
    else
    {
      grabInsertedChore(choreId, result);
      //result();
      //console.log("Assigned goblin id " + goblinId + " Assigned chore id: " + choreId);
    }
  });
};
  
function assignToLazyGoblin(houseId, choreId, result) {
  sql.query("SELECT goblin_id, SUM(effort_value) AS total FROM chore " +
    "WHERE house_id = ? AND goblin_id IS NOT NULL GROUP BY goblin_id", houseId, function(err, res) {
    if (err)
    {
      console.log("error: ", err);
      result(err, null);
    }
    else
    {
      /*console.log("New set of totals:");
      for(const display of res) {
        console.log(display);
      }*/
      let minIndex = indexOfMin(res);
      assignToGoblin(res[minIndex].goblin_id, choreId, result);
    }
  });
};
  
function grabInsertedChore(choreId, result) {
  sql.query("SELECT * FROM chore WHERE id = ? ", choreId, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      result(null, res[0]);
    }
  });
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function indexOfMin(arr) {
  if (arr.length === 0) {
    return -1;
  }

  let min = arr[0].total;
  let minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i].total < min) {
      minIndex = i;
      min = arr[i].total;
    }
  }

  return minIndex;
};
