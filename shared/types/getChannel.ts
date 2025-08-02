import { ChannelDto } from "./dto/Channel";

export type GetChannelRequest = {
  channelId: number;
};

export type GetChannelResponse = ChannelDto | null;
