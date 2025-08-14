import { GuildDto } from "./dto/Guild";

export type GetUserGuildsRequest = {
  userId: string;
};

export type GetUserGuildsResponse = Array<GuildDto>;
