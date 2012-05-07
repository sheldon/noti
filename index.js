#!/usr/bin/env node

var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    everyauth = require('everyauth'),
    conf = require('./conf.js');

everyauth.google
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.googleapis.com/auth/userinfo.email')
  .findOrCreateUser( function (session, accessToken, accessTokenExtra, googleUserMetadata) {
    googleUserMetadata.refreshToken = accessTokenExtra.refresh_token;
    googleUserMetadata.expiresIn = accessTokenExtra.expires_in;
    googleUserMetadata.id = 1;
    console.log(googleUserMetadata);
    return googleUserMetadata;
  })
  .redirectPath('/');

everyauth.helpExpress(app);

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret:"want above pig start"}));
  app.use(everyauth.middleware());
  app.use(app.router);
});

app.get('/message/:room/:message', function (req, res) {
  io.sockets.in(req.params.room).emit('message', req.params.message);
  res.end();
});

io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    if(data.oldroom) socket.leave(data.oldroom);
    if(data.room) socket.join(data.room);
  });
  
  socket.on('message', function (data) {
    if(data.room) io.sockets.in(data.room).emit('message', data.message);
  });
});

app.listen(8080);