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

type ReducedUser = {
  id: number;
  username: string;
  role: "Administrator" | "Player";
};
