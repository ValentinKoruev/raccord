import { Body, Controller, Get, HttpCode, HttpStatus, Request, Post, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInput, RegisterData } from '@shared/types/api';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() input: AuthInput) {
    return this.authService.authenticate(input);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async createUser(@Body() request: RegisterData) {
    return await this.authService.register(request);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getProtectedTestRoute(@Request() request) {
    return await this.authService.getLoggedUser(request.user.userId);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('raccord_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out' };
  }
}
