import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserGuilds(userId: number) {
    const response = await this.prisma.userOnGuild.findMany({
      where: {
        userId: userId,
      },
      include: {
        guild: true,
      },
    });

    return response.map((g) => g.guild);
  }
}
