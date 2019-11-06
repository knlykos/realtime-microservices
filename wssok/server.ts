import * as express from 'express';
import { Request, Response } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { connect, NatsConnectionOptions, Payload } from 'ts-nats';
// import { KSPJS110 } from '../../picking-ts/server/models/spModel.interface';
let wsClients: WebSocket[] = [];

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', async (ws: WebSocket, request: http.IncomingMessage) => {
  ws.on('message', async (msg: any) => {
    const ruta: any = JSON.parse(msg);
    let nc = await connect({ servers: ['nats://10.10.201.124:32771'] });
    nc.subscribe(`folio.${ruta.folio}.orden.${ruta.idOrden}`, (err, message) => {
      console.log('hola');
      if (err) {
        console.log('error', err);
      } else {
        ws.send(message.data);
      }
    });
  });
});
// wss.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {
//   ws.on('message', async (msg: string) => {
//     var slData = JSON.parse(msg) as {
//       route: {
//         clientId: number;
//         orderId: number;
//         surtidorId: number;
//         customerId: number;
//       };
//     };
//     const ruta: any = JSON.parse(msg);

//     let nc = await connect({ servers: ['nats://10.10.201.124:32771'] });
//     nc.subscribe(
//       `folio.${ruta.folio}.orden.${ruta.idOrden}`,
//       (err, message) => {
//         console.log('hola');
//         if (err) {
//           console.log('error', err);
//         } else {
//           ws.send(message.data);
//         }
//       },
//       {}
//     );
//   });
// });

//start our server
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${server.address()} :)`);
});
