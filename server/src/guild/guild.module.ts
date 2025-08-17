import { Module } from '@nestjs/common';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [GuildService],
  controllers: [GuildController],
  imports: [AuthModule],
})
export class GuildModule {}
