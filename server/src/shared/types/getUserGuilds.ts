import { GuildDto } from "./dto/Guild";

export type GetUserGuildsRequest = {
  userId: number;
};

export type GetUserGuildsResponse = Array<GuildDto>;
