import { ChannelDto } from "./Channel";
import { UserDto } from "./User";

export type GuildDto = {
  guildId: string;
  guildName: string;
  ownerId: string;
  icon?: string;
  banner?: string;
  members?: Array<UserDto>;
  channels?: Array<ChannelDto>;
};
