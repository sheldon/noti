var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/message/:room/:message', function (req, res) {
  console.log(req.params);
  io.sockets.in(req.params.room).emit('message', req.params.message);
  res.end();
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    console.log(data);
    socket.emit('message', {'message':'message received', 'data':data);
    if(data.room) socket.join(data.room);
  });
  
  socket.on('message', function (data) {
    if(data.room) socket.broadcast.to(data.room).emit('message', data.message);
  });
});
