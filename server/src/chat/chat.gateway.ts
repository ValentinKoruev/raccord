import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessageSocketRequest, MessageSocketResponse } from '@shared/types/messageSocket';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() messageRequest: MessageSocketRequest): void {
    // TODO: get user info when database and auth is implemented
    // for now just use dummy data
    const messageResponse: MessageSocketResponse = {
      message: {
        senderId: messageRequest.senderId,
        senderName: 'Raccford IV', // temporary, find sender name with id
        icon: '/src/assets/racc.jpeg',
        content: messageRequest.content,
        date: new Date(),
      },
    };

    client.broadcast.emit('message', messageResponse);
    this.server.to(client.id).emit('message', messageResponse);
  }
}
