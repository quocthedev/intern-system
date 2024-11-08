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

export type LoginWithGoogleResponseSuccess = {
  statusCode: "200";
  data: {
    tokenString: string;
    expiresInMilliseconds: number;
    id: string;
    name: string;
    role: string;
  };
};

export type LoginWithGoogleResponseFailed = {
  statusCode: Exclude<string, "200">;
  message: string;
};

export type LoginWithGoogleResponse =
  | LoginWithGoogleResponseSuccess
  | LoginWithGoogleResponseFailed;

export type PagingData<T> = {
  pageIndex: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pagingData: T[];
};

export type PaginationResponseSuccess<T> = {
  statusCode: "200";
  data: PagingData<T>;
};

export type PaginationResponseFailed = {
  statusCode: Exclude<string, "200">;
  message: string;
};

export type PaginationResponse<T> =
  | PaginationResponseSuccess<T>
  | PaginationResponseFailed;
