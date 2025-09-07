import { Injectable, NotFoundException } from '@nestjs/common';
import { GetChannelRequest, GetChannelResponse } from '@shared/types/api';
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

    if (!channel) throw new NotFoundException();

    return {
      id: channel.publicId,
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
              user: {
                publicId: request.userId,
              },
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

    if (!channel) throw new NotFoundException();

    return {
      id: channel.publicId,
      type: 'text', // TODO: Change when voice is added
      //? For now, only users have icons. If we add group icons in the future, we can handle it here.
      icon: !channel.isGroup
        ? {
            href: channel.users[0]?.user.icon ?? '',
            altColor: '#0f0', // temporary color
          }
        : undefined,
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

  async getFriendDirectChannel(request: { userId: string; friendId: string }) {
    // TODO: temporary solution, think of a better way to differentiate between 1-to-1 dm and group dms
    const channel = await this.prisma.directChannel.findFirst({
      where: {
        users: {
          every: {
            user: { publicId: { in: [request.userId, request.friendId] } },
          },
          some: {
            user: { publicId: request.userId },
          },
        },
      },
      include: {
        users: {
          where: {
            NOT: {
              user: {
                publicId: request.userId,
              },
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

    if (!channel) throw new NotFoundException();

    return {
      id: channel.publicId,
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
