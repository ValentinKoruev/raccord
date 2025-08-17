import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards } from '@nestjs/common';
import { GuildService } from './guild.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

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
}
