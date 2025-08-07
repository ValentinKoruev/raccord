import { Controller, Get, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { parseChannel } from '@shared/utils/channelFormatter';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/:id')
  getChannel(@Param() params: { id: string }) {
    // ? Id can be formatted like G_[guildId]:[channelId] or D_[channelId] depending on what type of channel it is
    const channelInfo = parseChannel(params.id);

    if (channelInfo.type == 'guild') return this.channelService.getGuildChannel({ channelId: channelInfo.channelId });

    if (channelInfo.type == 'direct') return this.channelService.getDirectChannel({ channelId: channelInfo.channelId });

    return null;
  }
}
