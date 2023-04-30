type UserCR = {
  username: string;
  role: "Administrator" | "Player";
  enabled: boolean;
};

type User = UserCR & {
  id: number;
};

type DBUser = UserCR & {
  id: number;
  hash: string;
};

type UserLogin = {
  username: string;
  password: string;
};
