import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
// import { Socket, Server } from 'sock'

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    throw new Error('Inicialized!');
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: { sender: string; message: string }) {
    this.wss.emit('chatToClient', message);
    // return 'Hello world!';
  }
}
