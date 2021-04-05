'use strict';

var fs = require('fs');
var goblinDeathFile = fs.readFileSync("./app/data/goblinDeathMessages.txt", "utf-8");
var goblinDeathMessages = goblinDeathFile.split("\n");
var goblinHitFile = fs.readFileSync("./app/data/goblinHitMessages.txt", "utf-8");
var goblinHitMessages = goblinHitFile.split("\n");
var goblinMissFile = fs.readFileSync("./app/data/goblinMissMessages.txt", "utf-8");
var goblinMissMessages = goblinMissFile.split("\n");
var goblinWinnerFile = fs.readFileSync("./app/data/goblinWinnerMessages.txt", "utf-8");
var goblinWinnerMessages = goblinWinnerFile.split("\n");


exports.getWinnerAndFightMessages = function(goblinList) {
    var highestTotalStats = 0;
    var battlingGoblins = JSON.parse(JSON.stringify(goblinList));
    var messages = [];
    var round = 1;
    

    //fast goblins go first
    battlingGoblins.sort(function(goblinA, goblinB) {
        return goblinB.speed < goblinA.speed;
    });
    battlingGoblins.forEach(function(goblin) {
        goblin.currentHP = goblin.hp;
    });
    var fightContinue = function(tempGoblins) {
        var aliveGoblins = 0;
        tempGoblins.forEach(function(goblin) {
            if (goblin.currentHP > 0) {
                aliveGoblins = aliveGoblins + 1;
            }
        });
        return aliveGoblins > 1;
    }
    while (fightContinue(battlingGoblins)) {
        //messages.push("Round " + round);
        battlingGoblins.forEach(function(attackingGoblin) {
            if (attackingGoblin.currentHP > 0) {
                var aliveTargets = battlingGoblins.filter(function(goblin, index, arr) {
                return goblin.currentHP > 0 && goblin.id != attackingGoblin.id;
                });
                var targetGoblinId = aliveTargets[Math.floor(Math.random() * aliveTargets.length)].id;
                var targetGoblin = battlingGoblins.filter(function(goblin, index, arr){
                    return goblin.id == targetGoblinId;
                });
                
                var chanceToMiss = 2 / (attackingGoblin.speed + 3);
                var misses = Math.random() <= chanceToMiss;
                if (misses) {
                    messages.push(makeMessageObj('miss', attackingGoblin, targetGoblin[0], 0));
                    //messages.push(exports.getRandomMissMessage(attackingGoblin.goblin_name, targetGoblin[0].goblin_name) + " (missed!)");
                    //messages.push(attackingGoblin.goblin_name + " misses while trying to hit " + targetGoblin[0].goblin_name + "!");
                } else {
                    var damage = attackingGoblin.strength - targetGoblin[0].defense - Math.trunc(Math.random() * 10 - 2);
                    if (damage <= 0) {damage = Math.trunc(Math.random() * 4) + 4;}
                    targetGoblin[0].currentHP = targetGoblin[0].currentHP - damage;
                    messages.push(makeMessageObj('hit', attackingGoblin, targetGoblin[0], damage));
                    //messages.push(exports.getRandomHitMessage(attackingGoblin.goblin_name, targetGoblin[0].goblin_name) + " (" + damage + " damage)");
                    //messages.push(attackingGoblin.goblin_name + " attacks " + targetGoblin[0].goblin_name + " for " + damage + " damage!");
                    if (targetGoblin[0].currentHP <= 0) {
                        messages.push(makeMessageObj('death', targetGoblin[0], null, 0));
                        //messages.push(exports.getRandomDeathMessage(targetGoblin[0].goblin_name));
                        //messages.push(targetGoblin[0].goblin_name + " is knocked out!");
                    }
                }
            } else {
                //messages.push(attackingGoblin.goblin_name + " is too weak to fight!");
            }
            
        });
        round = round + 1;
    }
    var aliveGoblins = battlingGoblins.filter(function(goblin, index, arr) {
        return goblin.currentHP > 0;
    });
    if (aliveGoblins.length == 0) {
        messages.push("it's a draw! Determining a random winner...");
        aliveGoblins[0] = battlingGoblins[0];
    } else {
        messages.push(makeMessageObj('win', aliveGoblins[0], null, 0));
        //messages.push(exports.getRandomWinnerMessage(aliveGoblins[0].goblin_name));
        //messages.push(aliveGoblins[0].goblin_name + " is the winner!");
    }
    var returnMessage = {
        winner:aliveGoblins[0].id,
        messageList:messages
    };
    //console.log(returnMessage);
    return returnMessage;
}

exports.getStatTotal = function(goblin) {
    return goblin.hp + goblin.speed + goblin.defense + goblin.strength;
}

exports.getHitMessage = function(attackerName, defenderName, messageId) {
    var hitMessage = goblinHitMessages[messageId];
    return exports.replaceGoblinNames(hitMessage, attackerName, defenderName);
}

exports.getRandomMissMessage = function(attackerName, defenderName) {
    var missMessage = goblinMissMessages[Math.floor(Math.random()*goblinMissMessages.length)];
    return exports.replaceGoblinNames(missMessage, attackerName, defenderName);
}

exports.getRandomDeathMessage = function(goblinName) {
    var deathMessage = goblinDeathMessages[Math.floor(Math.random()*goblinDeathMessages.length)];
    return exports.replaceGoblinNames(deathMessage, goblinName, null);
}

exports.getRandomWinnerMessage = function(goblinName) {
    var winnerMessage = goblinWinnerMessages[Math.floor(Math.random()*goblinWinnerMessages.length)];
    return exports.replaceGoblinNames(winnerMessage, goblinName, null);
}

//pass null for the second goblin string if it's a death or winner message
exports.replaceGoblinNames = function(format, goblinName1, goblinName2) {
    var formattedString = format;
    if (goblinName2) {
        formattedString = formattedString.replace('GOBLIN1', goblinName1);
        formattedString = formattedString.replace('GOBLIN2', goblinName2);
    } else {
        formattedString = formattedString.replace('GOBLIN', goblinName1);
    }
    return formattedString;
}

function makeMessageObj(messageType, attacker, target, damage) {
    var returnMessage = {};
    returnMessage.messageType = messageType;
    switch(messageType) {
        case 'hit':
            returnMessage.messageId = Math.floor(Math.random()*goblinHitMessages.length);
            returnMessage.message = exports.getHitMessage(attacker.goblin_name, target.goblin_name, returnMessage.messageId) + " (" + damage + " damage)";
            returnMessage.attacker = attacker.id;
            returnMessage.target = target.id;
            break;
        case 'miss':
            returnMessage.messageId = 0;
            returnMessage.message = exports.getRandomMissMessage(attacker.goblin_name, target.goblin_name);
            returnMessage.attacker = attacker.id;
            returnMessage.target = target.id;
            break;
        case 'death':
            returnMessage.messageId = 0;
            returnMessage.message = exports.getRandomDeathMessage(attacker.goblin_name);
            returnMessage.attacker = attacker.id;
            returnMessage.target = null;
            break;
        case 'win':
            returnMessage.messageId = 0;
            returnMessage.message = exports.getRandomWinnerMessage(attacker.goblin_name);
            returnMessage.attacker = attacker.id;
            returnMessage.target = null;
            break;

    }
    return returnMessage;
}
