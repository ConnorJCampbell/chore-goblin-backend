const path    = require("path");
var logger = require('./logger.js');
var fs = require('fs');
var sql = require('./db.js');
var assignChore = require('./app/chore-allocations/allocation.js');
var goblinFight = require('./InitiateGoblinFight.js');

if (!fs.existsSync('./logs')){
    fs.mkdirSync('./logs');
}
if (!fs.existsSync('./goblinFightHistory')){
    fs.mkdirSync('./goblinFightHistory');
}

if (process.argv.length != 3 || isNaN(process.argv[2])) {
    console.log("usage: node weeklyScript.js <house id>");
    process.exit(1);
}

var houseId = process.argv[2];
var dateEnd = logger.getDate(0);
var dateStart = logger.getDate(-7);

logger.logGeneral('making history for house ' + houseId + ' for dates ' + dateStart + ' to ' + dateEnd);

function makeNewWeek(houseId, dateStart, dateEnd) {
    sql.query("INSERT INTO week_history (house_id, date_start, date_end) VALUES (?, ?, ?)", [houseId, dateStart, dateEnd], function(err, res) {
        if (err) {
            logger.logError(err);
            console.log("error: ", err);
        } else {
            // var oldFileName = 'goblinFightResults/' + houseId + '_fight.json';
            // var newFileName = 'goblinFightHistory/' + res.insertId + '_fight.json';
            // if (fs.existsSync(oldFileName)) {
            //     fs.renameSync(oldFileName, newFileName);
            // } else {
            //     logger.logGeneral('no goblin fight exists for house ' + houseId + ', so can\'t make fight history for it');
            // }
            storeCurrentChoresInHistory(houseId, res.insertId);
        }
    });
}

function moveChoreFromWinnerToLoser(houseId, winnerId) {
    logger.logGeneral('moving a chore from the winner (id=' + winnerId + ') to some unlucky goblin in house ' + houseId);
    sql.query("SELECT * FROM chore WHERE goblin_id = ? ORDER BY effort_value DESC", [winnerId], function(err, res) {
        if (err) {
            logger.logError(err);
            console.log("error: ", err);
        } else {
            var choreId = res[0].id;
            sql.query("SELECT * FROM goblin WHERE id != ? AND house_id = ?", [winnerId, houseId], function(err, res) {
                if (err) {
                    logger.logError(err);
                    console.log("error: ", err);
                } else {
                    res.sort(() => Math.random() - 0.5); //shuffle results
                    logger.logGeneral('the unlucky goblin is ' + res[0].id);
                    var unluckyGoblinId = res[0].id
                    sql.query("UPDATE chore SET goblin_id = ? WHERE id = ?", [unluckyGoblinId, choreId], function(err, res) {
                        if (err) {
                            logger.logError(err);
                            console.log("error: ", err);
                        } else {
                            logger.logGeneral('moved a chore (id=' + choreId + ') to goblin #' + unluckyGoblinId + ' from goblin #' + winnerId);
                            
                            process.exit(0);
                        }
                    });
                }
            });
        }
    });
}

function storeCurrentChoresInHistory(houseId, weekId) {
    sql.query("SELECT * FROM chore WHERE house_id = ?", [houseId], function(err, res) {
        if (err) {
            logger.logError(err);
            console.log("error: ", err);
        } else {
            var choresToPlaceInHistory = [];
            res.forEach(function(chore) {
                chore.week_id = weekId;
                choresToPlaceInHistory.push([chore.title, chore.status, chore.effort_value, chore.house_id, chore.goblin_id, chore.week_id]);
            });
            try {
                sql.batch("INSERT INTO chore_history (title, status, effort_value, house_id, goblin_id, week_id) VALUES (?, ?, ?, ?, ?, ?)", choresToPlaceInHistory);
                sql.commit();
                //chore reassignment
                assignChore.rmAllChoreAllocations(houseId, function() {
                  assignChore.assignAllChores(houseId, function() {
                    goblinFight.goblinFightForHouseId(houseId, function(winnerId) {
                        var oldFileName = 'goblinFightResults/' + houseId + '_fight.json';
                        var newFileName = 'goblinFightHistory/' + weekId + '_fight.json';
                        if (fs.existsSync(oldFileName)) {
                            logger.logGeneral('copying fight ' + oldFileName + ' to ' + newFileName);
                            fs.copyFileSync(oldFileName, newFileName);
                        } else {
                            logger.logGeneral('no goblin fight exists for house ' + houseId + ', so can\'t make fight history for it');
                        }
                        moveChoreFromWinnerToLoser(houseId, winnerId);
                    });
                  });
                });  
            } catch (err) {
                logger.logError(err);
                sql.rollback();
                process.exit(1);
            }
        }
    });
}

makeNewWeek(houseId, dateStart, dateEnd);
//assignChore.rmAllChoreAllocations(houseId);
