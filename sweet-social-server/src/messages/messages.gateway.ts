import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { ChatboxPayload, MessagePayload } from './payload/chatbox.payload';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/auth/guards/ws.guard';
import { Socket } from 'socket.io'
import { MessagesService } from './messages.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  constructor(
    private readonly messagesService: MessagesService
  ) { }

  // Listen when user join global socket and change their status to "active"
  @UseGuards(WsGuard)
  @SubscribeMessage('active')
  handleActive(
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const room = socket['user'].username
    socket.join(room)

    return;
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('join-chatbox')
  handleJoinChatbox(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: ChatboxPayload
  ): Promise<void> {
    const user = socket['user']

    socket.join(payload.chatboxId)
    socket.to(payload.chatboxId).emit('user-joined', { username: user.username })

    return;
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('send-message')
  async handleSendMessage(socket: Socket, payload: MessagePayload) {
    try {
      const { chatboxId } = payload;
      const user = socket['user']

      const message = await this.messagesService.saveMessage(user.id, payload)

      socket.to(chatboxId).emit('message-received', { message });

    } catch (error) {
      throw new WsException('An error occurred when sending the message!')
    }
  }


  @UseGuards(WsGuard)
  @SubscribeMessage('leave-chatbox')
  handleLeaveChatbox(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: ChatboxPayload
  ): Promise<void> {
    const user = socket['user']
    
    socket.leave(payload.chatboxId)
    socket.to(payload.chatboxId).emit('user-left', { username: user.username })

    return;
  }
}
