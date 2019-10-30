import { Injectable } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  RedisOptions,
  ClientProxy,
} from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
const logger = new Logger('main');

@Injectable()
export class MathService {
  client: ClientProxy;
  constructor() {
    const redisOptions: RedisOptions = {
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:32768',
      },
    };
    this.client = ClientProxyFactory.create(redisOptions);
  }
  public accumulate(data: number[]) {
    return this.client.send<number, number[]>('add', data);
  }
}

// const microserviceOptions: ClientOptions = {
//   transport: Transport.TCP,
//   options: {
//     host: '127.0.0.1',
//     port: 8877,
//   },
// };

// const client = ClientProxyFactory.create(microserviceOptions);
// client
//   .send<number, number[]>('add', [1, 2, 3])
//   .subscribe(result => logger.log(result));
