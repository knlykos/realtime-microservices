import * as express from 'express';
import { Request, Response } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { connect, NatsConnectionOptions, Payload } from 'ts-nats';

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {
    //log the received message and send it back to the client
    console.log('received: %s', message);

    let nc = connect({ servers: ['nats://172.17.03:4222'] }).then(res => {
      res.subscribe('greetings', (err, msg) => {
        wss.clients.forEach(clients => {
          if (clients.readyState === WebSocket.OPEN) {
            clients.send(msg.data);
          }
        });
        console.log(msg);
      });
    });
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address()} :)`);
});
