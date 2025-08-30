import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserDirectResponse, GetUserGuildsRequest, GetUserGuildsResponse } from '@shared/types/api';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string) {
    return await this.prisma.user.findFirst({
      where: {
        publicId: userId,
      },
    });
  }

  async getUserByName(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        name: username,
      },
    });
  }

  async getUserGuilds(request: GetUserGuildsRequest): Promise<GetUserGuildsResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        publicId: request.userId,
      },
      select: {
        publicId: true,
        joinedGuilds: {
          include: {
            guild: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException();

    const response: GetUserGuildsResponse = user.joinedGuilds.map((g) => ({
      guildId: g.guild.publicId,
      guildName: g.guild.name,
      ownerId: g.guild.owner.publicId,
      icon: g.guild.icon ?? undefined,
      banner: g.guild.banner ?? undefined,
    }));

    return response;
  }

  async getUserFriends(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        publicId: userId,
      },
      include: {
        friends: true,
      },
    });

    if (!user) return;

    return user.friends;
  }

  async getAllUserChannels(userId: string) {
    const query = await this.prisma.user.findFirst({
      where: {
        publicId: userId,
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

  async getUserDirectChannels(userId: string): Promise<GetUserDirectResponse> {
    const channels = await this.prisma.directChannel.findMany({
      where: {
        users: {
          some: {
            user: {
              publicId: userId,
            },
          },
        },
      },
      include: {
        users: {
          where: {
            NOT: {
              user: {
                publicId: userId,
              },
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    return channels.map((c) => ({
      publicId: c.publicId,
      name: c.users.map((u) => u.user.name).join(', '),
      users: c.users,
      icon: c.users.length > 1 ? c.users[0].user.name[0] : (c.users[0].user.icon ?? undefined),
    }));
  }
}
