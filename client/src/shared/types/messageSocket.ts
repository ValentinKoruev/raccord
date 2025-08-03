import { MessageDto } from "./dto/Message";

export type MessageSocketRequest = {
  senderId: number;
  channelId: string;
  content: string;
};
export type MessageSocketResponse = {
  message: MessageDto;
  channelId: string;
};
