var net = require('net');

var sockets = [];

net.createServer(function(socket){
  socket.once('data', function(key){
    if(!sockets[key]) sockets[key] = [];
    sockets[key].push(socket);
    socket.on('data', function(buf){
      for(var i in sockets[key]) if(sockets[key][i]._handle) sockets[key][i].write(buf);
    });
    socket.on('end', function(){
      for(var i in sockets[key]) if(!sockets[key][i]._handle) sockets[key].splice(i,1);
    });
  });
}).listen(process.env.PORT);
