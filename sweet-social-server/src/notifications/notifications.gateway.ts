import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  private server: Server;

  sendPostNotification(
    recipient: string,
    payload: any
  ) {
    this.server.to(recipient).emit('received-post-reminder', payload)
    return;
  }
}
