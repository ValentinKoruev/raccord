import { Controller, Get, Param } from '@nestjs/common';
import { GuildService } from './guild.service';

@Controller('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get('/:id')
  getGuild(@Param() params: any) {
    return this.guildService.getGuild({ guildId: params.id });
  }

  @Get('/:id/channels')
  getChannels(@Param() params: any) {
    const guildId: number = Number.parseInt(params.id);
    return this.guildService.getChannels(guildId);
  }
}
