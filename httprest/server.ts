import * as express from 'express';
import { Request, Response } from 'express';
import { connect, NatsConnectionOptions, Payload } from 'ts-nats';
const app = express();
const port = 3001;

app.post('/', async (req: Request, res: Response) => {
  let nc = await connect({ servers: ['nats://172.17.03:4222'] });

  var slData = { subscription: 'Listado de toda la orden' };

  nc.publish('greetings', JSON.stringify(slData));

  res.send('Respuesta del POST');
});

app.listen(port, () => console.log('Servidor HTTP Running'));
