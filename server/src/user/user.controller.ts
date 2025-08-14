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

  @Get('channels')
  getUserChannels() {
    return this.userService.getAllUserChannels(-1);
  }

  @Get('friends')
  getUserFriends() {
    return this.userService.getUserFriends(-1);
  }

  @UseGuards(AuthGuard)
  @Get('direct')
  getUserDirectChannels(@Req() request) {
    return this.userService.getUserDirectChannels(request.user.userId);
  }
}
