var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var routes = require('./routes/index');
var users = require('./routes/users');
var history = require('./app/data/history');
var pathToHistory = __dirname + '/app/data/history.json';

var app = express();
var debug = require('debug')('chat');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


// view engine setup
app.set('views', path.join(__dirname, 'app'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

function getHistory(){
  return fs.readFileSync(pathToHistory,'utf8');
}

//socket.io

var io = require('socket.io')(server);
var serverOnlineUsers = [];
var prohibited = ['<script>', '<style>', 'applet'];

var urlList = [];
var audioCounter = 0;

io.on('connection', function(socket){
  var serverName;
  var serverNameColor;

  io.emit('drawHistory', getHistory());

  socket.on('user login', function(newUserInfo) {
    serverName = newUserInfo.name;
    serverNameColor = newUserInfo.color;
    serverOnlineUsers.push(serverName);
    io.emit('user login', serverName, serverNameColor, serverOnlineUsers);
  });

  socket.on('disconnect', function(){
    audioCounter = 0;
    urlList = [];
    console.log(serverOnlineUsers);
    
    for ( var i = 0; i < serverOnlineUsers.length; i++ ) {
      if ( serverOnlineUsers[i] === serverName ) {
        serverOnlineUsers.splice(i, 1);
      }
    }

    io.emit('disconnect',  serverName, serverOnlineUsers);

  });

  socket.on('chat message', function(msg, time, userData){

    var oldHistory = JSON.parse(getHistory());
    var freshHistory = oldHistory.concat(userData);

    fs.writeFile(pathToHistory, JSON.stringify(freshHistory,0 , 4), function(err) {
      if (err) { throw err };
    });

    io.emit('chat message', serverName, serverNameColor, time, msg);



  });

  // socket.on('chat message', function(msg, time, userData){
  //   for ( gg in userData ) {
  //     for ( var i = 0; i < prohibited.length; i++) {
  //       if ( userData[gg].toString().search(prohibited[i]) >= 0  ) {
  //         console.log('chiter!');
  //       } else {
  //         var oldHistory = JSON.parse(getHistory());
  //         var freshHistory = oldHistory.concat(userData);

  //         fs.writeFile(pathToHistory, JSON.stringify(freshHistory,0 , 4), function(err) {
  //           if (err) { throw err };
  //         });

  //         io.emit('chat message', serverName, serverNameColor, time, msg);
  //       }
  //     }
  //   }
  // });

});


































