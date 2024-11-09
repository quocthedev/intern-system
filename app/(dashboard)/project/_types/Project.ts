import { PaginationResponse } from "@/libs/types";

type User = {
  fullName: string;
  gender: string;
  id: string;
};

type GroupUserRelated = {
  role: string;
  count: number;
  users: User[];
};

export type Project = {
  title: string;
  productUri: string;
  zaloUri: string;
  startDate: string;
  releaseDate: string;
  status: string;
  groupUserRelated: GroupUserRelated[];
  listPosition: { name: string }[];
  listTechnology: { name: string }[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetProjectResponse = PaginationResponse<Project>;
