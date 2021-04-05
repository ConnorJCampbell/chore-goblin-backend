var fs = require('fs');
const path = require("path");

exports.getDateTime = function() {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	return date+' '+time;
}

exports.getDate = function(offset) {
	var today = new Date();
	return today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate() + offset);
}

exports.logAPIReq = function(apiname, request) {
	var logMessage = exports.getDateTime() + ' API Call: ' + apiname + '\nREQUEST:' + JSON.stringify(request) + '\n';
	var fileName = path.join(__dirname+'/logs/' + exports.getDate(0) + '_choregoblinlog.txt');
	fs.appendFileSync(fileName, logMessage);
}

exports.logAPIRes = function(apiname, response) {
	var logMessage = exports.getDateTime() + ' API Call: ' + apiname + '\nRESPONSE:' + JSON.stringify(response) + '\n';
	var fileName = path.join(__dirname+'/logs/' + exports.getDate(0) + '_choregoblinlog.txt');
	fs.appendFileSync(fileName, logMessage);
}

exports.logGeneral = function(message) {
	var logMessage = exports.getDateTime() + ' GENERAL LOG: ' + message + '\n';
	var fileName = path.join(__dirname+'/logs/' + exports.getDate(0) + '_choregoblinlog.txt');
	fs.appendFileSync(fileName, logMessage);
}

exports.logError = function(errormsg) {
	var logMessage = exports.getDateTime() + ' ******ERROR********* \n' + errormsg + '\n';
	var fileName = path.join(__dirname+'/logs/' + exports.getDate(0) + '_choregoblinlog.txt');
	fs.appendFileSync(fileName, logMessage);
}
