type User = {
  id: number;
  username: string;
  hash: string;
  role: "Administrator" | "Player";
  enabled: boolean;
};

type UserLogin = {
  username: string;
  password: string;
};

type LoginCookiePayload = {
  id: number;
  username: string;
  role: "Administrator" | "Player";
};
