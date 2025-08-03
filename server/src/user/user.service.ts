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
      guildId: g.guildId,
      guildName: g.guild.name,
      icon: g.guild.icon ?? undefined,
      banner: g.guild.banner ?? undefined,
    }));

    return response;
  }

  async getAllUserChannels(userId: number) {
    const query = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        directChannels: true,
        joinedGuilds: {
          include: {
            guild: {
              select: {
                publicId: true,
                name: true,
                channels: {
                  select: {
                    name: true,
                    publicId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!query) return null;

    // ? big guild channel map spageti: maps the channels of every guild the user is in,
    // ? flattens them on 1 level, and adds the guild name and public id to the object
    return {
      directChannels: query.directChannels,
      guildChannels: query.joinedGuilds.flatMap((joinedGuild) => {
        return joinedGuild.guild.channels.map((channel) => ({
          ...channel,
          guildName: joinedGuild.guild.name,
          guildPublicId: joinedGuild.guild.publicId,
        }));
      }),
    };
  }
}
