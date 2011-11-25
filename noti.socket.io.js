var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/message/:message_data', function (req, res) {
  io.sockets.emit('message', req.params.message_data);
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    socket.broadcast.emit('message', data);
  });
});