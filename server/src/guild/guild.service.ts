import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuildRequest, GetGuildRequest, GetGuildResponse, JoinGuildRequest } from '@shared/types/api';

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
      },
    });

    if (!guild) return null;

    return {
      guildId: guild.publicId,
      guildName: guild.name,
      icon: guild.icon ?? undefined,
      banner: guild.banner ?? undefined,
      channels: guild.channels.map((c) => {
        return {
          id: c.publicId, // TODO: use DTO
          name: c.name,
          type: 'text', // TODO: Change this when voice support is added
        };
      }),
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
            throw new BadRequestException('Guild or user not found');
          default:
            throw error;
        }
      }
      throw error; //? non-Prisma errors
    }
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
