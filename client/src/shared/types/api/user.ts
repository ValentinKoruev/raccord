import { GuildDto } from "../dto/Guild";

export type GetUserGuildsRequest = {
  userId: string;
};

export type GetUserGuildsResponse = Array<GuildDto>;

export type GetUserDirectResponse = Array<{
  publicId: string;
  name: string;
  users: Array<any>; // TODO: user dto
  icon?: string | undefined;
}>;
