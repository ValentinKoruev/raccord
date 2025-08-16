import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInput } from '@shared/types/api';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() input: AuthInput) {
    return this.authService.authenticate(input);
  }

  // test route
  @UseGuards(AuthGuard)
  @Get('protected')
  getProtectedTestRoute(@Request() request) {
    return request.user;
  }
}
