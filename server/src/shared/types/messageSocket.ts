import { MessageDto } from "./dto/Message";

export type MessageSocketRequest = {
  senderId: number;
  content: string;
};
export type MessageSocketResponse = {
  message: MessageDto;
};
