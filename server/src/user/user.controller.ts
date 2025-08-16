import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/guilds')
  getUserGuilds(@Req() request) {
    return this.userService.getUserGuilds({ userId: request.user.userId });
  }

  @UseGuards(AuthGuard)
  @Get('channels')
  getUserChannels(@Req() request) {
    return this.userService.getAllUserChannels(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('friends')
  getUserFriends(@Req() request) {
    return this.userService.getUserFriends(request.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('direct')
  getUserDirectChannels(@Req() request) {
    return this.userService.getUserDirectChannels(request.user.userId);
  }
}
