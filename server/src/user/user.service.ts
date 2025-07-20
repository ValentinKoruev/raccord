import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserGuildsRequest, GetUserGuildsResponse } from '@shared/types/getUserGuilds';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserGuilds(getUserGuildsReq: GetUserGuildsRequest): Promise<GetUserGuildsResponse> {
    const query = await this.prisma.userOnGuild.findMany({
      where: {
        userId: getUserGuildsReq.userId,
      },
      include: {
        guild: true,
      },
    });

    const response: GetUserGuildsResponse = query.map((g) => ({
      guildName: g.guild.name,
      icon: g.guild.icon ?? undefined,
      banner: g.guild.banner ?? undefined,
    }));

    return response;
  }
}
