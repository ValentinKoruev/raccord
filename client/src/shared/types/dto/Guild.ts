import { ChannelDto } from "./Channel";

export type GuildDto = {
  guildId;
  guildName: string;
  icon?: string;
  banner?: string;
  channels?: Array<ChannelDto>;
};
