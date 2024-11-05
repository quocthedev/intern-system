export type LoginResponseSuccess = {
  statusCode: "200";
  data: {
    tokenString: string;
    id: string;
    name: string;
    role: string;
    expiresInMilliseconds: number;
  };
};

export type LoginResponseFailed = {
  statusCode: Exclude<string, "200">;
  message: string;
};

export type LoginResponse = LoginResponseSuccess | LoginResponseFailed;
