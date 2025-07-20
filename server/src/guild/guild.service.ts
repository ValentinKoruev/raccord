import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async getChannels() {
    const channels = await this.prisma.guildChannel.findMany({
      where: {
        guildId: -1,
      },
      include: {
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
