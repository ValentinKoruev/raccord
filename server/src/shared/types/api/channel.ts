import { ChannelDto } from "../dto/Channel";

export type GetChannelRequest = {
  channelId: string;
  userId: string;
};

export type GetChannelResponse = ChannelDto | null;
