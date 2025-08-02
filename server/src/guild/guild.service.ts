import { Injectable } from '@nestjs/common';
import { GetGuildRequest, GetGuildResponse } from '@shared/types/getGuild';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async getGuild(request: GetGuildRequest): Promise<GetGuildResponse> {
    const guild = await this.prisma.guild.findFirst({
      where: {
        id: request.guildId,
      },
      include: {
        channels: {
          include: {
            messages: {
              include: {
                sender: true,
              },
              take: 10,
            },
          },
        },
      },
    });

    if (!guild) return null;

    return {
      guildId: guild.id,
      guildName: guild.name,
      icon: guild.icon ?? undefined,
      banner: guild.banner ?? undefined,
      channels: guild.channels.map((c) => {
        return {
          id: c.id,
          name: c.name,
          type: 'text', // TODO: Change this when voice support is added
        };
      }),
    };
  }

  async getChannels(guildId: number) {
    const channels = await this.prisma.guildChannel.findMany({
      where: {
        guildId: guildId,
      },
      include: {
        guild: true,
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    return channels;
  }
}
