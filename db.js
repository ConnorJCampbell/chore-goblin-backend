'use strict';

var mariadb = require('mariadb/callback');

//local mariadb db connection
var connection = mariadb.createConnection({
    host     : '131.104.48.205',
    user     : 'dbuser',
    password : 'password',
    database : 'chore_goblin',
    connectionLimit: 5
});

connection.connect(err => {
  if (err) {
    console.log("bruh we ain't connected due to error: " + err);
  } else {
    console.log("Got a DB connection, with thread " + connection.threadId);
  }
});

module.exports = connection;
