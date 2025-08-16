import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as cookie from 'cookie';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { MessageService } from 'src/message/message.service';
import { JwtService } from '@nestjs/jwt';
import { MessageSocketRequest, MessageSocketResponse } from '@shared/types/api';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client) {
    try {
      const cookies = client.handshake.headers.cookie;

      if (!cookies) throw new WsException('Session cookie not found. Connection refused.');

      const parsedCookies = cookie.parse(cookies);
      const session = parsedCookies['raccord_session'];

      if (!session) throw new WsException('Session not found. Connection refused.');

      const tokenPayload = await this.jwtService.verifyAsync(session);
      client.user = {
        userId: tokenPayload.sub,
        username: tokenPayload.username,
      };

      const channels = await this.userService.getAllUserChannels(client.user.userId);

      if (!channels) return;

      for (let channel of channels.guildChannels) {
        client.join(`G_${channel.guildPublicId}:${channel.publicId}`);
      }
    } catch (err) {
      client.disconnect();
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() client, @MessageBody() messageRequest: MessageSocketRequest): Promise<void> {
    const user = await this.userService.getUser(client.user.userId);

    if (!user) return;

    // TODO: get user info when database and auth is implemented
    // for now just use dummy data
    const messageResponse: MessageSocketResponse = {
      message: {
        senderId: user.publicId,
        senderName: user.name,
        icon: user.icon ?? undefined,
        content: messageRequest.content,
        date: new Date(),
      },
      channelId: messageRequest.channelId,
    };

    // ? refactor when adding sent/delivered/seen functionality
    await this.messageService.createMessage({
      channelInfo: messageRequest.channelId,
      message: messageResponse.message,
    });

    // ? currently doesn't use rooms, but user does join them, they just aren't used yet
    client.broadcast.emit('message', messageResponse);
    this.server.to(client.id).emit('message', messageResponse);
  }
}
