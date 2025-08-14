import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UserModule, MessageModule, AuthModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
