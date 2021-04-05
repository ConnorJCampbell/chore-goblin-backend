'use strict';

var goblinFight = require("./app/lib/goblinFight.js");
var sql = require('./db.js');
var fs = require('fs'); 
var logger = require('./logger.js');

// if (process.argv.length != 3 || isNaN(process.argv[2])) {
//   console.log("usage: node InitiateGoblinFight.js <house id>");
//   process.exit(1);
// }

if (!fs.existsSync('./goblinFightResults')){
    fs.mkdirSync('./goblinFightResults');
}

// var houseId = process.argv[2];



exports.goblinFightForHouseId = function(houseId, callback) {
  logger.logGeneral('starting goblin fight for house id ' + houseId);
  sql.query("SELECT * FROM goblin WHERE house_id = ? ", houseId, function(err, res) {
    if (err) {
      console.log("error: ", err);
      
    } else {
      if (res.length == 0) {
        console.log("you fucking donkey this house doesn't exist or there's no goblins in it");
        process.exit(1);
      }
      var result = goblinFight.getWinnerAndFightMessages(res);
      //console.log(result);
      var fileName = 'goblinFightResults/' + res[0].house_id + '_fight.json';
      fs.writeFileSync(fileName, JSON.stringify(result)); 
      console.log('Wrote new goblin fight at ' + fileName);
      callback(result.winner);
    }
  });
}

// exports.goblinFightForHouseId(houseId, function(winnerId) {console.log('done'); process.exit(0);});

// var goblins = JSON.parse('[{"id":7,"owner_name":"Caleb","goblin_name":"Grignr","hp":25,"strength":26,"defense":27,"speed":28,"appearance":null,"house_id":1,"free_points":5},{"id":8,"owner_name":"Alejandro","goblin_name":"Jeffery","hp":99,"strength":5,"defense":12,"speed":0,"appearance":null,"house_id":1,"free_points":3},{"id":9,"owner_name":"Guy Fieri 2.0","goblin_name":"Mikey","hp":10,"strength":1,"defense":1,"speed":1,"appearance":"","house_id":1,"free_points":0},{"id":10,"owner_name":"Noah","goblin_name":"Brian","hp":1,"strength":7,"defense":5,"speed":2,"appearance":null,"house_id":1,"free_points":199},{"id":15,"owner_name":"Connor","goblin_name":"Tayne","hp":10,"strength":1,"defense":1,"speed":1,"appearance":"","house_id":1,"free_points":0}]');
// var result = goblinFight.getWinnerAndFightMessages(goblins);
// console.log(result);
