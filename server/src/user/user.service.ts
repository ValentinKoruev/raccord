import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetUserDirectResponse, GetUserGuildsRequest, GetUserGuildsResponse, RegisterData } from '@shared/types/api';
import { UserDto } from '@shared/types/dto/User';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        publicId: userId,
      },
      select: {
        publicId: true,
        name: true,
        icon: true,
        description: true,
      },
    });

    if (!user) return null;

    return {
      publicId: user.publicId,
      name: user.name,
      icon: user.icon ?? undefined,
      description: user.description ?? undefined,
    };
  }

  async getUserByName(username: string) {
    return await this.prisma.user.findFirst({
      where: {
        name: username,
      },
    });
  }

  async getUserGuilds(request: GetUserGuildsRequest): Promise<GetUserGuildsResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        publicId: request.userId,
      },
      select: {
        publicId: true,
        joinedGuilds: {
          include: {
            guild: {
              include: {
                owner: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new NotFoundException();

    const response: GetUserGuildsResponse = user.joinedGuilds.map((g) => ({
      guildId: g.guild.publicId,
      guildName: g.guild.name,
      ownerId: g.guild.owner.publicId,
      icon: g.guild.icon ?? undefined,
      banner: g.guild.banner ?? undefined,
    }));

    return response;
  }

  async getUserFriends(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        publicId: userId,
      },
      include: {
        friends: true,
      },
    });

    if (!user) return;

    return user.friends;
  }

  async getAllUserChannels(userId: string) {
    const query = await this.prisma.user.findFirst({
      where: {
        publicId: userId,
      },
      select: {
        directChannels: true,
        joinedGuilds: {
          include: {
            guild: {
              select: {
                publicId: true,
                name: true,
                channels: {
                  select: {
                    name: true,
                    publicId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!query) return null;

    // ? big guild channel map spageti: maps the channels of every guild the user is in,
    // ? flattens them on 1 level, and adds the guild name and public id to the object
    return {
      directChannels: query.directChannels,
      guildChannels: query.joinedGuilds.flatMap((joinedGuild) => {
        return joinedGuild.guild.channels.map((channel) => ({
          ...channel,
          guildName: joinedGuild.guild.name,
          guildPublicId: joinedGuild.guild.publicId,
        }));
      }),
    };
  }

  async getUserDirectChannels(userId: string): Promise<GetUserDirectResponse> {
    const channels = await this.prisma.directChannel.findMany({
      where: {
        users: {
          some: {
            user: {
              publicId: userId,
            },
          },
        },
      },
      include: {
        users: {
          where: {
            NOT: {
              user: {
                publicId: userId,
              },
            },
          },
          include: {
            user: true,
          },
        },
      },
    });

    return channels.map((c) => ({
      publicId: c.publicId,
      name: c.users.map((u) => u.user.name).join(', '),
      users: c.users,
      icon: c.users.length > 1 ? c.users[0].user.name[0] : (c.users[0].user.icon ?? undefined),
    }));
  }

  private validateUserCreate(values: RegisterData) {
    const missingFields: Array<string> = [];

    if (!values.username.trim()) missingFields.push('username');
    if (!values.password.trim()) missingFields.push('password');
    if (!values.repassword.trim()) missingFields.push('repassword');
    if (!values.email.trim()) missingFields.push('email');

    return missingFields;
  }

  async createUser(values: RegisterData) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const missingFields = this.validateUserCreate(values);
    if (missingFields.length > 0) {
      throw new BadRequestException(`Required fields are missing: ${missingFields.join(', ')}`);
    }

    if (!emailRegex.test(values.email)) throw new BadRequestException('Provided email is not a valid email address.');

    if (values.password !== values.repassword) throw new BadRequestException('Passwords do not match.');

    const hashedPassword = await bcrypt.hash(values.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          name: values.username,
          email: values.email,
          password: hashedPassword,
          icon: values.icon,
        },
      });

      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
          case 'P2002':
            throw new ConflictException('Email is already in use.');
        }
      }

      throw new InternalServerErrorException('Unexpected error occured');
    }
  }
}
