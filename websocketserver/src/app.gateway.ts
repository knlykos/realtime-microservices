import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'net';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('App');
  afterInit() {
    this.logger.log('Initialized');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client connected:     ${client.id}`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected:     ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(
    client: Socket,
    text: { event: string; data: string },
  ): WsResponse<string> {
    // client.emit('msgToClient', text);
    return { event: text.event, data: text.data };
  }
}
