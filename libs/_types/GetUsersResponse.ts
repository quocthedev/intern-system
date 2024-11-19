export type User = {
  fullName: string;
  gender: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type UsersByRole = {
  role: string;
  users: User[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetUsersByRoleResponse = {
  statusCode: number;
  message: string;
  data: UsersByRole;
};
