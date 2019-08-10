import * as express from 'express';
import { Request, Response } from 'express';
import { connect, NatsConnectionOptions, Payload } from 'ts-nats';
import * as bodyParser from 'body-parser';
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.text());

app.post('/', async (req: Request, res: Response) => {
  let nc = await connect({ servers: ['nats://172.17.03:4222'] });
  console.log(req.body);
  var slData = req.body as {
    clientId: number;
    orderId: number;
    surtidorId: number;
    customerId: number;
  };

  nc.publish(
    `{"orderId": ${slData.orderId}, "surtidorId": ${slData.surtidorId}, "customerId": ${
      slData.customerId
    }}`,
    JSON.stringify(slData)
  );

  res.send('Respuesta del POST');
});

app.listen(port, () => console.log('Servidor HTTP Running'));
