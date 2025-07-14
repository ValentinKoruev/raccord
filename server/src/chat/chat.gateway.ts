import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

type MessageRequest = {
  user: string;
  content: string;
};
type MessageResponse = {
  username: string;
  content: string;
  image: string;
  date: Date;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messageRequest: MessageRequest,
  ): void {
    // TODO: get user info when database and auth is implemented
    // for now just use dummy data
    const messageResponse: MessageResponse = {
      username: messageRequest.user,
      content: messageRequest.content,
      image: '/src/assets/whatsapp.jpg', // hardcoded lol
      date: new Date(),
    };

    client.broadcast.emit('message', messageResponse);
    this.server.to(client.id).emit('message', messageResponse);
  }
}
