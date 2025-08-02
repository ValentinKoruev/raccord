import { GuildDto } from "./dto/Guild";

export type GetGuildRequest = {
  guildId: number;
};

export type GetGuildResponse = GuildDto | null;
