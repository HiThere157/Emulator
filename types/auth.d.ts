type AuthConfigCR = {
  canLogin: boolean;
  canRegister: boolean;
  maxUsers: number;
};

type AuthConfig = AuthConfigCR & {
  secret: string;
};
