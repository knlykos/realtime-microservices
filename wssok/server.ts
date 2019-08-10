import * as express from 'express';
import { Request, Response } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { connect, NatsConnectionOptions, Payload } from 'ts-nats';
let wsClients: WebSocket[] = [];

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

function nc() {
  return connect({ servers: ['nats://172.17.03:4222'] });
}
wss.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {
  // nc().then(res => {
  //   res.subscribe('update-orders', (err, msg) => {});
  // });
  ws.on('message', (msg: string) => {
    var slData = JSON.parse(msg) as {
      route: {
        clientId: number;
        orderId: number;
        surtidorId: number;
        customerId: number;
      };
    };
    nc().then(res => {
      res.subscribe(
        `{"orderId": ${slData.route.orderId}, "surtidorId": ${
          slData.route.surtidorId
        }, "customerId": ${slData.route.customerId}}`,
        (err, msg) => {
          console.log(err);
          console.log(msg);
        }
      );
    });
  });
  // res.subscribe('update-orders', (err, msg) => {
  //   ws.on('message', (message: string) => {
  //     var event = JSON.parse(message);
  //     ws.emit(msg.data.type, 'test');
  //   });
  // });
  //connection is up, let's add a simple simple event
  // ws.on('message', (message: string) => {
  //   var event = JSON.parse(message);
  //   ws.emit(event.type, event.payload);
  //   //log the received message and send it back to the client
  //   // ws.send(`Hello, you sent -> ${message}`);
  // }).on('authenticate', e => {
  //   ws.send(`Hello, you sent -> ${JSON.stringify(e)}`);
  //   wsClients[e.clientId] = ws;
  //   wsClients.forEach((v, i, a) => {
  //     if (v.readyState === v.OPEN) {
  //       v.send('hey' + i);
  //     }
  //   });
  // });
  //send immediatly a feedback to the incoming connection
  // ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${server.address()} :)`);
});
