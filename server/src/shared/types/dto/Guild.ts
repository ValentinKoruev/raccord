import { ChannelDto } from "./Channel";

export type GuildDto = {
  guildId: string;
  guildName: string;
  ownerId: string;
  icon?: string;
  banner?: string;
  channels?: Array<ChannelDto>;
};
