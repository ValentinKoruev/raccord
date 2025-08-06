import { Controller, Get, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/direct')
  getDirectChannels() {
    return this.channelService.getDirectChannels(-1);
  }

  @Get('/:id')
  getChannel(@Param() params: { id: string }) {
    // ? Id can be formatted like G_[channelId] or D_[channelId] depending on what type of channel it is
    const channelInfo = params.id.split('_');

    if (channelInfo[0] == 'G') return this.channelService.getGuildChannel({ channelId: channelInfo[1] });

    if (channelInfo[0] == 'D') return this.channelService.getDirectChannel({ channelId: channelInfo[1] });

    return null;
  }
}
