import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateGuildRequest,
  GetGuildRequest,
  GetGuildResponse,
  JoinGuildRequest,
  RemoveGuildRequest,
} from '@shared/types/api';

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async getGuild(request: GetGuildRequest): Promise<GetGuildResponse> {
    const guild = await this.prisma.guild.findFirst({
      where: {
        publicId: request.guildId,
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
        owner: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!guild) return null;

    return {
      guildId: guild.publicId,
      guildName: guild.name,
      ownerId: guild.owner.publicId,
      icon: guild.icon ?? undefined,
      banner: guild.banner ?? undefined,
      channels: guild.channels.map((c) => {
        return {
          id: c.publicId, // TODO: use DTO
          name: c.name,
          type: 'text', // TODO: Change this when voice support is added
        };
      }),
      members: guild.members.map((e) => ({
        publicId: e.user.publicId,
        name: e.user.name,
        icon: e.user.icon ?? undefined,
      })),
    };
  }

  async createGuild(request: CreateGuildRequest) {
    const user = await this.prisma.user.findFirst({
      where: {
        publicId: request.userId,
      },
    });

    if (!user) throw new NotFoundException(`User ${request.userId} not found.`);

    // TODO: Validate input

    const guild = await this.prisma.guild.create({
      data: {
        name: request.guildName,
        icon: request.guildIcon ?? undefined,
        owner: {
          connect: {
            publicId: request.userId,
          },
        },
        members: {
          create: { user: { connect: { publicId: request.userId } } },
        },
        channels: {
          create: {
            name: 'General',
          },
        },
      },
    });

    return guild;
  }

  //? NOTE: This is the type of error handling needed when implementing error handling on the api
  async joinGuild(request: JoinGuildRequest) {
    try {
      await this.prisma.userOnGuild.create({
        data: {
          user: { connect: { publicId: request.userId } },
          guild: { connect: { publicId: request.guildId } },
        },
      });
    } catch (error) {
      //? Prisma specific errors:
      //? P2025: Record not found, gets thrown when connect doesn't find a user/guild
      //? P2002: Unique key constraint failed, in this case the id is [userId, guildId], so if user is already in the guild it gets thrown
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new ConflictException('User is already a member of guild.');
          case 'P2025':
            throw new NotFoundException('Guild or user not found');
          default:
            throw error;
        }
      }
      throw error; //? non-Prisma errors
    }
  }

  async leaveGuild(request: RemoveGuildRequest) {
    const query = await this.prisma.userOnGuild.findFirst({
      where: {
        user: { publicId: request.userId },
        guild: { publicId: request.guildId },
      },
    });

    if (!query) {
      throw new NotFoundException(`User not part of guild.`);
    }

    await this.prisma.userOnGuild.delete({
      where: {
        userId_guildId: {
          userId: query.userId,
          guildId: query.guildId,
        },
      },
    });
  }

  async getChannels(guildId: string) {
    const channels = await this.prisma.guildChannel.findMany({
      where: {
        guild: {
          publicId: guildId,
        },
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

  async createChannel({ guildId, userId, channelName }: { guildId: string; userId: string; channelName: string }) {
    const guild = await this.prisma.guild.findUnique({
      where: { publicId: guildId },
      select: { id: true, owner: true },
    });

    if (!guild) throw new NotFoundException('Guild not found');

    if (guild.owner.publicId !== userId) {
      throw new ForbiddenException('Only the guild owner can create channels');
    }

    // Create the channel
    return this.prisma.guildChannel.create({
      data: {
        name: channelName,
        guildId: guild.id,
      },
    });
  }
}
