import { MessageDto } from "./Message";

export type ChannelDto = {
  id: string;
  name: string;
  type: "text" | "voice";
  icon?: {
    href: string;
    altColor: string;
  };
  messages?: Array<MessageDto>;
};
