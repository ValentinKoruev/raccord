import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthInput, AuthOutput, RegisterData, TokenData } from '@shared/types/api';

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

    if (!user) return null;

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (isMatch) {
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

    return { accessToken };
  }

  async register(request: RegisterData) {
    const user = await this.userService.createUser(request);

    return this.generateToken({ userId: user.publicId, username: user.name });
  }

  async getLoggedUser(userId: string) {
    const user = await this.userService.getUser(userId);

    if (!user) throw new UnauthorizedException();

    return {
      userId: user.publicId,
      username: user.name,
      theme: user.theme ?? 'BLURPLE',
    };
  }
}
