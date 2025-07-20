import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: Get servers for current logged in user when auth is added, temp using id of -1, which is the seeded user
  @Get('guilds')
  getUserServers() {
    return this.userService.getUserGuilds({ userId: -1 });
  }
}
