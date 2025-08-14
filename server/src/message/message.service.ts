import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from '@shared/types/dto/Message';
import { parseChannel } from '@shared/utils/channelFormatter';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  createMessage = async ({ channelInfo, message }: { channelInfo: string; message: MessageDto }) => {
    const parsedChannel = parseChannel(channelInfo);

    if (parsedChannel.type == 'guild') {
      const channel = await this.prisma.guildChannel.findFirst({
        where: {
          publicId: parsedChannel.channelId,
        },
      });

      if (!channel) return null;

      const result = await this.prisma.guildMessage.create({
        data: {
          content: message.content,
          createdAt: message.date,
          sender: {
            connect: {
              publicId: message.senderId,
            },
          },
          channel: {
            connect: {
              id: channel.id,
            },
          },
        },
      });

      return result;
    }

    if (parsedChannel.type == 'direct') {
      const channel = await this.prisma.directChannel.findFirst({
        where: {
          publicId: parsedChannel.channelId,
        },
      });

      if (!channel) return null;

      const result = await this.prisma.directMessage.create({
        data: {
          content: message.content,
          createdAt: message.date,
          sender: {
            connect: {
              publicId: message.senderId,
            },
          },
          directChannel: {
            connect: {
              publicId: parsedChannel.channelId,
            },
          },
        },
      });

      return result;
    }

    return;
  };
}
