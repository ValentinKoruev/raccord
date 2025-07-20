export type GetUserGuildsRequest = {
  userId: number;
};

export type GetUserGuildsResponse = Array<{
  guildName: string;
  icon?: string;
  banner?: string;
}>;
