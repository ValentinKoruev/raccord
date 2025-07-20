import { Controller, Get } from '@nestjs/common';
import { GuildService } from './guild.service';

@Controller('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get('channels')
  getChannels() {
    return this.guildService.getChannels();
  }
}
