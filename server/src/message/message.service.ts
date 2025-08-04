import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from '@shared/types/dto/Message';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  createMessage = async ({ channelId, message }: { channelId: string; message: MessageDto }) => {
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
  };
}
