export interface AuthInput {
  username: string;
  password: string;
}

export interface AuthOutput {
  userId: string;
  username: string;
}

export interface TokenData {
  accessToken: string;
}
