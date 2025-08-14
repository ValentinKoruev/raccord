import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { GuildModule } from './guild/guild.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { JwtProviderModule } from './jwt-provider/jwt-provider.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GuildModule,
    PrismaModule,
    UserModule,
    ChannelModule,
    MessageModule,
    AuthModule,
    JwtProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
