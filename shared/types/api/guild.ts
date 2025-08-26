import { GuildDto } from "../dto/Guild";

export type GetGuildRequest = {
  guildId: string;
};

export type GetGuildResponse = GuildDto | null;

export type CreateGuildRequest = {
  userId: string;
  guildName: string;
  guildIcon?: string;
};

export type JoinGuildRequest = {
  userId: string;
  guildId: string;
};

export type RemoveGuildRequest = {
  userId: string;
  guildId: string;
};
