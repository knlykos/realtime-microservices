import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { Logger } from '@nestjs/common';
const logger = new Logger('main');

async function bootstrap() {
  // 32768;
  // TCP
  // const microserviceOptions = {
  //   transport: Transport.TCP,
  //   options: {
  //     host: '127.0.0.1',
  //     port: 8877,
  //   },
  // };

  // REDIS

  const microserviceOptions = {
    transport: Transport.NATS,
    options: {
      url: 'redis://localhost:32771',
    },
  };

  const app = await NestFactory.createMicroservice(
    AppModule,
    microserviceOptions,
  );
  app.listen(() => {
    logger.log('Microservice is listening...');
  });
}
bootstrap();
