var app = require('express').createServer(),
    io = require('socket.io').listen(app);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/message/:room/:message', function (req, res) {
  io.sockets.in(req.params.room).emit('message', req.params.message);
  res.end();
});

io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    if(data.room) socket.join(data.room);
  });
  
  socket.on('message', function (data) {
    if(data.room) io.sockets.in(data.room).emit('message', data.message);
  });
});

app.listen(3000);