import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GuildService } from './guild.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateGuildChannelRequest } from '@shared/types/api';

@Controller('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('/create')
  async createGuild(@Req() request, @Body() body: { guildName: string; guildIcon?: string }) {
    // TODO: Validate body
    const guild = await this.guildService.createGuild({
      userId: request.user.userId,
      guildName: body.guildName,
      guildIcon: body.guildIcon,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('/join')
  async join(@Req() request, @Body() body: { guildId: string }) {
    // TODO: Validate body
    const guild = await this.guildService.joinGuild({
      userId: request.user.userId,
      guildId: body.guildId,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('/leave')
  async delete(@Req() request, @Body() body: { guildId: string }) {
    const guild = await this.guildService.leaveGuild({
      userId: request.user.userId,
      guildId: body.guildId,
    });
  }

  @Get('/:id')
  getGuild(@Param() params: any) {
    return this.guildService.getGuild({ guildId: params.id });
  }

  @Get('/:id/channels')
  getChannels(@Param() params: any) {
    return this.guildService.getChannels(params.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('/:id/channels')
  createChannel(@Req() request, @Param() params, @Body() body: CreateGuildChannelRequest) {
    console.log({
      guildId: params.id,
      userId: request.user.userId,
      channelName: body.channelName,
    });
    return this.guildService.createChannel({
      guildId: params.id,
      userId: request.user.userId,
      channelName: body.channelName,
    });
  }
}
