import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthInput, AuthOutput, TokenData } from '@shared/types/auth';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput) {
    const user = await this.validateUser(input);

    if (!user) throw new UnauthorizedException();

    return this.generateToken(user);
  }

  async validateUser(input: AuthInput): Promise<AuthOutput | null> {
    const user = await this.userService.getUserByName(input.username);

    // TODO: hash password
    if (user && user.password === input.password) {
      return {
        userId: user.publicId,
        username: user.name,
      };
    }

    return null;
  }

  async generateToken(user: AuthOutput): Promise<TokenData> {
    const tokenPayload = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    return { accessToken, username: user.username, userId: user.userId };
  }
}
