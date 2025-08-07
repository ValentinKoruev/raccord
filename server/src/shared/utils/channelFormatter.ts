type GuildChannelInfo = {
  type: "guild";
  guildId: string;
  channelId: string;
};

type DirectChannelInfo = {
  type: "direct";
  channelId: string;
};

type ChannelInfo = GuildChannelInfo | DirectChannelInfo;

export const formatGuildChannel = (guildId: string, channelId: string) => {
  return `G_${guildId}:${channelId}`;
};

export const formatDirectChannel = (channelId: string) => {
  return `D_${channelId}`;
};

export const parseChannel = (key: string): ChannelInfo => {
  if (key.startsWith("D_"))
    return { type: "direct", channelId: key.substring(2) };
  else if (key.startsWith("G_")) {
    const [guildId, channelId] = key.substring(2).split(":");
    return { type: "guild", guildId: guildId, channelId };
  }

  throw new Error("Invalid key format");
};
