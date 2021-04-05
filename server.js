const express = require('express');
app = express();
bodyParser = require('body-parser');
port = process.env.PORT || 3000;
const path    = require("path");
var logger = require('./logger.js');
var fs = require('fs');

if (!fs.existsSync('./logs')){
    fs.mkdirSync('./logs');
}

app.listen(port);

console.log('we are running the chore goblin API server with this port: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Send HTML at root, do not change
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/index.js', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/index.js'));
});

app.get('/quitButton.js', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/quitButton.js'));
});

app.get('/goblins',function(req,res){
  res.sendFile(path.join(__dirname+'/public/goblins.html'));
});

app.get('/goblinList.js',function(req,res){
  res.sendFile(path.join(__dirname+'/public/goblinList.js'));
});

app.get('/chores',function(req,res){
  res.sendFile(path.join(__dirname+'/public/chores.html'));
});

app.get('/choreList.js',function(req,res){
  res.sendFile(path.join(__dirname+'/public/choreList.js'));
});

app.get('/sideNav.js', function(req, res){
  res.sendFile(path.join(__dirname+'/public/sideNav.js'))
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

app.get('/favicon.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/gb_launcher.png'));
});

//TODO: remove these and actually have goblin assets
app.get('/placeholder.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder.png'));
});
app.get('/placeholder1.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder1.png'));
});
app.get('/placeholder2.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder2.png'));
});
app.get('/placeholder3.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder3.png'));
});
app.get('/placeholder4.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder4.png'));
});
app.get('/placeholder5.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder5.png'));
});
app.get('/placeholder6.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/GoblinPlaceholder6.png'));
});
app.get('/thonkeykong.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/thonkeykong.png'));
});

app.get('/logo.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/assets/gb_launcher.png'));
});



var routes = require('./app/routes/appRoutes'); //importing route
routes(app); //register the route

app.use(function(req, res, next) {
  logger.logError(req);
  return res.status(404).sendFile(path.join(__dirname+'/public/404.html'));
});