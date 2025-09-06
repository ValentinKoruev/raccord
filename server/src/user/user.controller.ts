import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async getUser(@Req() request) {
    return await this.userService.getUser(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('/guilds')
  async getUserGuilds(@Req() request) {
    return await this.userService.getUserGuilds({ userId: request.user.userId });
  }

  @UseGuards(AuthGuard)
  @Get('channels')
  async getUserChannels(@Req() request) {
    return await this.userService.getAllUserChannels(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('friends')
  async getUserFriends(@Req() request) {
    return await this.userService.getUserFriends(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post('friends')
  async addFriend(@Req() request, @Body() body) {
    return await this.userService.addFriend({ userId: request.user.userId, friendId: body.friendId });
  }

  @UseGuards(AuthGuard)
  @Get('direct')
  async getUserDirectChannels(@Req() request) {
    return await this.userService.getUserDirectChannels(request.user.userId);
  }
}
