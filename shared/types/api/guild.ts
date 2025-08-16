import { GuildDto } from "../dto/Guild";

export type GetGuildRequest = {
  guildId: string;
};

export type GetGuildResponse = GuildDto | null;
