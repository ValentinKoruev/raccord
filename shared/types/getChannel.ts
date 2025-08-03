import { ChannelDto } from "./dto/Channel";

export type GetChannelRequest = {
  channelId: string;
};

export type GetChannelResponse = ChannelDto | null;
