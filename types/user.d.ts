type UserCR = {
  username: string;
  role: "Administrator" | "Player";
  enabled: boolean;
};

type User = UserCR & {
  id: number;
  hash: string;
};

type ReducedUser = UserCR & {
  id: number;
};

type UserLogin = {
  username: string;
  password: string;
};
