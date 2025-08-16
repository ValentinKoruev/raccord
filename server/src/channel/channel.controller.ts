import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { parseChannel } from '@shared/utils/channelFormatter';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @UseGuards(AuthGuard)
  @Get('/:id')
  getChannel(@Req() request, @Param() params: { id: string }) {
    // ? Id can be formatted like G_[guildId]:[channelId] or D_[channelId] depending on what type of channel it is
    const channelInfo = parseChannel(params.id);

    if (channelInfo.type == 'guild')
      return this.channelService.getGuildChannel({ channelId: channelInfo.channelId, userId: request.user.userId });

    if (channelInfo.type == 'direct')
      return this.channelService.getDirectChannel({ channelId: channelInfo.channelId, userId: request.user.userId });

    return null;
  }
}
