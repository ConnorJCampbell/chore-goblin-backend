'use strict';

const path    = require("path");
var logger = require('./logger.js');
var fs = require('fs');
var sql = require('./db.js');
var bcrypt = require('bcrypt');
var goblinFight = require('./InitiateGoblinFight.js');
const saltRounds = 10;

var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync("bruh", salt);

if (!fs.existsSync('./goblinFightHistory')){
    fs.mkdirSync('./goblinFightHistory');
}

function makeHouseCode(length) {
   var result           = '';
   var characters       = 'abcdefghijkmnpqrstuvwxyz23456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

var houseCode = makeHouseCode(6);

console.log('new house being made, house code is ' + houseCode);
logger.logGeneral('new house being made, house code is ' + houseCode);

var houseName = 'Chorekey Boys';

sql.query("INSERT INTO house (code, name, battle_interval, hashed_password) VALUES (?, ?, ?, ?)", [houseCode, houseName, 0, hash], function(err, res) {
    if (err) {
        logger.logError(err);
        console.log(err);
    } else {
        var houseId = res.insertId;
        console.log('new house id=' + houseId);
        logger.logGeneral('new house id=' + houseId);
        var goblins = [
            {
                goblin_name:'Grignr',
                owner_name:'Caleb',
                house_id:houseId,
                hp:35,
                strength:25,
                defense:10,
                speed:2,
                appearance:'1',
                free_points:2
            },
            {
                goblin_name:'Tayne',
                owner_name:'Connor',
                house_id:houseId,
                hp:30,
                strength:20,
                defense:20,
                speed:5,
                appearance:'2',
                free_points:4
            },
            {
                goblin_name:'MyNameJeff',
                owner_name:'Alejandro',
                house_id:houseId,
                hp:36,
                strength:17,
                defense:17,
                speed:12,
                appearance:'3',
                free_points:0
            },
            {
                goblin_name:'Exodia',
                owner_name:'Noah',
                house_id:houseId,
                hp:100,
                strength:4,
                defense:30,
                speed:1,
                appearance:'4',
                free_points:0
            }
        ]
        var goblinsToAdd = [];
        goblins.forEach(function(g) {
            goblinsToAdd.push([g.goblin_name, g.owner_name, g.house_id, g.hp, g.strength, g.defense, g.speed, g.appearance, g.free_points]);
        });
         try {
            sql.batch("INSERT INTO goblin (goblin_name, owner_name, house_id, hp, strength, defense ,speed, appearance, free_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", goblinsToAdd);
            sql.commit();
            console.log('added the following to goblins:\n');
            console.log(goblinsToAdd);
            console.log('');
            sql.query("SELECT * FROM goblin WHERE house_id = ?", houseId, function(err, res) {
                if (err) {
                    logger.logError(err);
                    console.log(err);
                } else {
                    var goblinRes = res;
                    var chores = [
                        ['Wash dishes', 'incomplete', 3, houseId, res[0].id],
                        ['Sweep floor (living room/kitchen)', 'complete', 4, houseId, res[0].id],
                        ['Empty green bin', 'incomplete', 5, houseId, res[0].id],
                        ['Shovel driveway (throughout week)', 'incomplete', 6, houseId, res[1].id],
                        ['Scrub toilets', 'incomplete', 7, houseId, res[1].id],
                        ['Dust living room', 'incomplete', 2, houseId, res[2].id],
                        ['Take out beer empties', 'complete', 3, houseId, res[2].id],
                        ['Mop kitchen', 'incomplete', 4, houseId, res[2].id],
                        ['Wipe kitchen counters', 'incomplete', 3, houseId, res[2].id],
                        ['Take out trash', 'incomplete', 4, houseId, res[3].id],
                        ['Scrub bathtub', 'incomplete', 5, houseId, res[3].id],
                        ['Ensure liquor cabinet is stocked', 'incomplete', 5, houseId, res[3].id],
			['Buy pizza for the house', 'complete', 1, houseId, res[2].id],
			['Take the dog for walks every day', 'incomplete', 4, houseId, res[1].id]
                    ];
                    try {
                        sql.batch("INSERT INTO chore (title, status, effort_value, house_id, goblin_id) VALUES (?, ?, ?, ?, ?)", chores);
                        sql.commit();
                        console.log('added the following to chores:\n');
                        console.log(chores);
                        console.log('');
                        var weeks = [
                            ['2019-10-30', '2019-11-05', houseId],
                            ['2019-11-07', '2019-11-12', houseId],
                            ['2019-11-13', '2019-11-19', houseId]
                        ]
                        try {
                            sql.batch("INSERT INTO week_history (date_start, date_end, house_id) VALUES (?, ?, ?)", weeks);
                            sql.commit();
                            console.log('added the following to week history:\n');
                            console.log(weeks);
                            console.log('');
                            sql.query("SELECT * FROM week_history WHERE house_id = ?", houseId , function(err, res) {
                                if (err) {
                                    logger.logError(err);
                                    console.log(err);
                                    process.exit(1);
                                } else {
                                    var chore_histories = [
                                        ['Wash dishes', 'complete', 3, houseId, goblinRes[2].id, res[0].id],
                                        ['Sweep floor (living room/kitchen)', 'complete', 4, houseId, goblinRes[2].id, res[0].id],
                                        ['Empty green bin', 'complete', 5, houseId, goblinRes[2].id, res[0].id],
                                        ['Shovel driveway (throughout week)', 'complete', 6, houseId, goblinRes[2].id, res[0].id],
                                        ['Scrub toilets', 'complete', 7, houseId, goblinRes[1].id, res[0].id],
                                        ['Dust living room', 'complete', 2, houseId, goblinRes[3].id, res[0].id],
                                        ['Take out beer empties', 'complete', 3, houseId, goblinRes[1].id, res[0].id],
                                        ['Mop kitchen', 'complete', 4, houseId, goblinRes[3].id, res[0].id],
                                        ['Wipe kitchen counters', 'complete', 3, houseId, goblinRes[1].id, res[0].id],
                                        ['Take out trash', 'complete', 4, houseId, goblinRes[0].id, res[0].id],
                                        ['Scrub bathtub', 'complete', 5, houseId, goblinRes[3].id, res[0].id],
                                        ['Ensure liquor cabinet is stocked', 'complete', 5, houseId, goblinRes[0].id, res[0].id],
                                        ['Wash dishes', 'complete', 3, houseId, goblinRes[2].id, res[1].id],
                                        ['Sweep floor (living room/kitchen)', 'complete', 4, houseId, goblinRes[2].id, res[1].id],
                                        ['Empty green bin', 'complete', 5, houseId, goblinRes[0].id, res[1].id],
                                        ['Shovel driveway (throughout week)', 'complete', 6, houseId, goblinRes[2].id, res[1].id],
                                        ['Scrub toilets', 'complete', 7, houseId, goblinRes[1].id, res[1].id],
                                        ['Dust living room', 'complete', 2, houseId, goblinRes[3].id, res[1].id],
                                        ['Take out beer empties', 'complete', 3, houseId, goblinRes[1].id, res[1].id],
                                        ['Mop kitchen', 'complete', 4, houseId, goblinRes[0].id, res[1].id],
                                        ['Wipe kitchen counters', 'complete', 3, houseId, goblinRes[1].id, res[1].id],
                                        ['Take out trash', 'complete', 4, houseId, goblinRes[3].id, res[1].id],
                                        ['Scrub bathtub', 'complete', 5, houseId, goblinRes[3].id, res[1].id],
                                        ['Ensure liquor cabinet is stocked', 'complete', 5, houseId, goblinRes[2].id, res[1].id],
					['Buy pizza for the house', 'complete', 1, houseId, goblinRes[0].id, res[1].id],
                                        ['Wash dishes', 'complete', 3, houseId, goblinRes[2].id, res[2].id],
                                        ['Sweep floor (living room/kitchen)', 'complete', 4, houseId, goblinRes[1].id, res[2].id],
                                        ['Empty green bin', 'complete', 5, houseId, goblinRes[3].id, res[2].id],
                                        ['Shovel driveway (throughout week)', 'incomplete', 6, houseId, goblinRes[3].id, res[2].id],
                                        ['Scrub toilets', 'incomplete', 7, houseId, goblinRes[1].id, res[2].id],
                                        ['Dust living room', 'complete', 2, houseId, goblinRes[1].id, res[2].id],
                                        ['Take out beer empties', 'complete', 3, houseId, goblinRes[2].id, res[2].id],
                                        ['Mop kitchen', 'incomplete', 4, houseId, goblinRes[0].id, res[2].id],
                                        ['Wipe kitchen counters', 'complete', 3, houseId, goblinRes[2].id, res[2].id],
                                        ['Take out trash', 'incomplete', 4, houseId, goblinRes[2].id, res[2].id],
                                        ['Scrub bathtub', 'complete', 5, houseId, goblinRes[2].id, res[2].id],
                                        ['Ensure liquor cabinet is stocked', 'complete', 5, houseId, goblinRes[0].id, res[2].id],
					['Buy pizza for the house', 'complete', 1, houseId, goblinRes[1].id, res[2].id],
					['Take the dog for walks every day', 'complete', 4, houseId, goblinRes[3].id, res[2].id]
                                    ]
                                    try {
                                        sql.batch("INSERT INTO chore_history (title, status, effort_value, house_id, goblin_id, week_id) VALUES (?, ?, ?, ?, ?, ?)", chore_histories);
                                        sql.commit();
                                        console.log('added the following to chore history:\n');
                                        console.log(chore_histories);
                                        console.log('');
                                        console.log('adding fights to house now');
                                        goblinFight.goblinFightForHouseId(houseId, function(winnerId) {
                                            var oldFileName = 'goblinFightResults/' + houseId + '_fight.json';
                                            var newFileName = 'goblinFightHistory/' + res[0].id + '_fight.json';
                                            fs.renameSync(oldFileName, newFileName);
                                            console.log('made fight ' + newFileName);
                                            goblinFight.goblinFightForHouseId(houseId, function(winnerId) {
                                                var oldFileName = 'goblinFightResults/' + houseId + '_fight.json';
                                                var newFileName = 'goblinFightHistory/' + res[1].id + '_fight.json';
                                                fs.renameSync(oldFileName, newFileName);
                                                console.log('made fight ' + newFileName);
                                                goblinFight.goblinFightForHouseId(houseId, function(winnerId) {
                                                    var oldFileName = 'goblinFightResults/' + houseId + '_fight.json';
                                                    var newFileName = 'goblinFightHistory/' + res[2].id + '_fight.json';
                                                    fs.copyFileSync(oldFileName, newFileName);
                                                    console.log('made fight ' + newFileName);
                                                    process.exit(0);
                                                });
                                            });
                                        });
                                    } catch (err) {
                                        logger.logError(err);
                                        console.log(err);
                                        sql.rollback();
                                        process.exit(1);
                                    }
                                }
                            });
                        } catch (err) {
                            logger.logError(err);
                            console.log(err);
                            sql.rollback();
                            process.exit(1);
                        }
                    } catch (err) {
                        logger.logError(err);
                        console.log(err);
                        sql.rollback();
                        process.exit(1);
                    }
                }
            });
            
        } catch (err) {
            logger.logError(err);
            sql.rollback();
            process.exit(1);
        }
    }
});
