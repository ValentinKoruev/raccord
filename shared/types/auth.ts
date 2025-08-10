export interface AuthInput {
  username: string;
  password: string;
}

export interface AuthOutput {
  userId: string;
  username: string;
}

// ? Might be a better idea to use AuthOutput as an object, but the jwt structures looks different since userId is sub as per convention.
export interface TokenData {
  accessToken: string;
  userId: string;
  username: string;
}
