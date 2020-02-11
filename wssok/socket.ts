import * as socketio from 'socket.io';
import { connect, NatsConnectionOptions, Payload, Client } from 'ts-nats';

var app = require('express')();
var http = require('http').createServer(app);
var io: SocketIO.Server = require('socket.io')(http);

function nc(): Promise<Client> {
  return connect({ servers: ['nats://10.10.201.124:4223'] });
}

// app.all('/*', function(req, res, next) {
//   res.header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
//   next();
// });

io.on('connection', function(socket: socketio.Socket) {
  socket.on('ksp100-sl', data => {
    console.log('data.room', data.room);
    socket.join(data.room);
    nc().then(res => {
      res.subscribe(data.room, (err, msg) => {
        console.log(msg);
        io.sockets.in(msg.subject).emit('ksp100-sl', JSON.parse(msg.data));
        res.close();
      });
    });
  });

  socket.on('ksp110-sls', data => {
    console.log('data.room', data.room);
    socket.join(data.room);
    nc().then(res => {
      res.subscribe(data.room, (err, msg) => {
        // console.log(msg);
        io.sockets.in(msg.subject).emit('ksp110-sls', JSON.parse(msg.data));
        res.close();
      });
    });
  });

  socket.on('ksp110-sl', data => {
    console.log('data.room', data.room);
    socket.join(data.room);
    nc().then(res => {
      res.subscribe(data.room, (err, msg) => {
        io.sockets.in(msg.subject).emit('ksp110-sl', JSON.parse(msg.data));
        res.close();
      });
    });
  });

  // ksp110 - slp;
  socket.on('ksp110-slp', data => {
    console.log('data.room', data.room);
    socket.join(data.room);
    nc().then(res => {
      res.subscribe(data.room, (err, msg) => {
        console.log(msg);
        io.sockets.in(msg.subject).emit('ksp110-slp', JSON.parse(msg.data));
        res.close();
      });
    });
  });

  socket.on('ksp110-slsag', data => {
    console.log('data.room', data.room);
    socket.join(data.room);
    console.log('ksp110-slsag', data.room);
    nc().then(res => {
      res.subscribe(data.room, (err, msg) => {
        console.log(msg);
        io.sockets.in(msg.subject).emit('ksp110-slsag', JSON.parse(msg.data));
        res.close();
      });
    });
  });
});

// ksp110.slsagp.orden.${this.kSpJs110.param_in.pidOrden}.folio.${this.kSpJs110.param_in.pFolio}

http.listen(3000, function() {
  console.log('listening on *:3000');
});

// io.listen(3000, { cookie: false, origins: '*' });
