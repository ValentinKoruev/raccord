import { Injectable } from '@nestjs/common';
import { GetChannelRequest, GetChannelResponse } from '@shared/types/getChannel';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService) {}

  async getGuildChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    const channel = await this.prisma.guildChannel.findFirst({
      where: {
        publicId: request.channelId,
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
      id: channel.publicId, // ! refactor this to be clear that it's using publicId, not internal id
      type: 'text', // TODO: Change when voice is added
      name: channel.name,
      messages: channel.messages.map((m) => ({
        senderId: m.sender.publicId,
        senderName: m.sender.name,
        content: m.content,
        icon: m.sender.icon ?? undefined,
        date: m.createdAt,
      })),
    };
  }

  async getDirectChannel(request: GetChannelRequest): Promise<GetChannelResponse> {
    // TODO: Check if user is apart of the channel when auth is added

    const channel = await this.prisma.directChannel.findFirst({
      where: {
        publicId: request.channelId,
      },
      include: {
        users: {
          where: {
            NOT: {
              userId: -1, // TODO: Get current user Id
            },
          },
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
          },
        },
      },
    });

    if (!channel) return null;

    return {
      id: channel.publicId, // ! refactor this to be clear that it's using publicId, not internal id
      type: 'text', // TODO: Change when voice is added
      name: channel.users.map((u) => u.user.name).join(', '), // TODO: Add custom name to channels
      messages: channel.messages.map((m) => ({
        senderId: m.sender.publicId,
        senderName: m.sender.name,
        content: m.content,
        icon: m.sender.icon ?? undefined,
        date: m.createdAt,
      })),
    };
  }
}
