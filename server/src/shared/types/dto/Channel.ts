import { MessageDto } from "./Message";

export type ChannelDto = {
  id: number;
  name: string;
  type: "text" | "voice";
  messages?: Array<MessageDto>;
};
