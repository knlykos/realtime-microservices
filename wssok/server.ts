import * as express from 'express';
import { Request, Response } from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { connect, NatsConnectionOptions, Payload } from 'ts-nats';
import { KSPJS110 } from '../../picking-ts/server/models/spModel.interface';
let wsClients: WebSocket[] = [];

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let kSpJs110: KSPJS110 = {
  param_in: {
    pAction: '',
    pSucursal: 0,
    pidOrden: 2,
    pFolio: 13,
    pCodigo: '',
    pIdUsu: 0,
    pCodigoSust: '',
    pLpn: '',
    pSurtido: 0
  }
};
// function nc() {
//   return connect({ servers: ['nats://10.10.201.124:32771'] });
// }

// const nConn = nc();
wss.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {
  // nc().then(res => {
  //   res.subscribe('update-orders', (err, msg) => {});
  // });
  ws.on('message', async (msg: string) => {
    var slData = JSON.parse(msg) as {
      route: {
        clientId: number;
        orderId: number;
        surtidorId: number;
        customerId: number;
      };
    };
    const ruta: any = JSON.parse(msg);
    console.log(ruta.folio);
    let nc = await connect({ servers: ['nats://10.10.201.124:32771'] });
    nc.subscribe(`folio.${ruta.folio}.orden.${ruta.idOrden}`, (err, message) => {
      console.log('hola')
      if (err) {
        console.log('error', err);
      } else {
          //         wss.clients.forEach(client => {
            
          //   if (client !== ws && client.readyState === WebSocket.OPEN) {
          //     client.send(message.data)
          //   }
          // })
          ws.send(message.data);
      }
    }, {})
    // nc.then(res => {
    //   res.subscribe(`folio.${13}.orden.${2}`, (err, message) => {
    //     console.log(err === null);
    //     if (err === null) {
    //       wss.clients.forEach(client => {
    //         console.log(wss.clients);
    //         if (client !== ws && client.readyState === WebSocket.OPEN) {
    //           client.send(JSON.stringify(message))
    //         }
    //       })
    //     }
    //   })
    //   res.close();
    // });
  });

});

//start our server
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server started on port ${server.address()} :)`);
});
