import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from '@shared/types/dto/Message';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  createMessage = async ({ channelInfo, message }: { channelInfo: string; message: MessageDto }) => {
    const [channelType = undefined, channelId = undefined] = channelInfo.split('_', 2);

    if (channelType == 'G') {
      const channel = await this.prisma.guildChannel.findFirst({
        where: {
          publicId: channelId,
        },
      });

      if (!channel) return null;

      const result = await this.prisma.guildMessage.create({
        data: {
          content: message.content,
          createdAt: message.date,
          sender: {
            connect: {
              id: message.senderId,
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

    if (channelType == 'D') {
      const channel = await this.prisma.directChannel.findFirst({
        where: {
          publicId: channelId,
        },
      });

      if (!channel) return null;

      const result = await this.prisma.directMessage.create({
        data: {
          content: message.content,
          createdAt: message.date,
          sender: {
            connect: {
              id: message.senderId,
            },
          },
          directChannel: {
            connect: {
              publicId: channelId,
            },
          },
        },
      });

      return result;
    }

    return;
  };
}
