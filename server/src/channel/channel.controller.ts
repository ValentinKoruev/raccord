import { Controller, Get, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('/:id')
  getChannel(@Param() params: any) {
    return this.channelService.getChannel({ channelId: params.id });
  }
}
