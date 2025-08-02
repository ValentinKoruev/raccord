import { Injectable } from '@nestjs/common';
import { GetChannelRequest, GetChannelResponse } from '@shared/types/getChannel';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  // ! ONLY WORKS FOR GUILD CHANNELS, FURTHER IMPLEMENTATION NEEDED FOR DIRECT
  async getChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    const channel = await this.prisma.guildChannel.findFirst({
      where: {
        id: request.channelId,
      },
      include: {
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    if (!channel) return null;

    return {
      id: channel.id,
      type: 'text', // TODO: Change when voice is added
      name: channel.name,
      messages: channel.messages.map((m) => ({
        senderId: m.senderId,
        senderName: m.sender.name,
        content: m.content,
        icon: m.sender.icon ?? undefined,
        date: m.createdAt,
      })),
    };
  }
}
