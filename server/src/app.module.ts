import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { GuildModule } from './guild/guild.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [ChatModule, ConfigModule.forRoot(), GuildModule, PrismaModule, UserModule, ChannelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
