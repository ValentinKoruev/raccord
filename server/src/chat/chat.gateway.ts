import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { MessageSocketRequest, MessageSocketResponse } from '@shared/types/messageSocket';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    // TODO: validate and search for current user when auth is added
    const channels = await this.userService.getAllUserChannels(-1);

    if (!channels) return;

    for (let channel of channels.guildChannels) {
      client.join(`G_${channel.guildPublicId}:${channel.publicId}`);
    }
  }

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
      channelId: messageRequest.channelId,
    };

    // ? currently doesn't use rooms, but user does join them, they just aren't used yet
    client.broadcast.emit('message', messageResponse);
    this.server.to(client.id).emit('message', messageResponse);
  }
}
