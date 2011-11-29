var app = require('express').createServer(),
    io = require('socket.io').listen(app);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/message/:room/:message', function (req, res) {
  //console.log(req.params);
  io.sockets.in(req.params.room).emit('message', req.params.message);
  res.end();
});

io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    //console.log(data);
    socket.emit('message', {'message':'message received', 'data':data});
    if(data.room) socket.join(data.room);
    //console.log(io.sockets.manager.rooms);
  });
  
  socket.on('message', function (data) {
    //console.log(data);
    if(data.room) io.sockets.in(data.room).emit('message', data.message);
  });
});

app.listen(3000);