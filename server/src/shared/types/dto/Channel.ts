import { MessageDto } from "./Message";

export type ChannelDto = {
  id: string;
  name: string;
  type: "text" | "voice";
  messages?: Array<MessageDto>;
};
