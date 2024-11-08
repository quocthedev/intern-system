import { PaginationResponse } from "@/libs/types";

export type Project = {
  title: string;
  productUri: string;
  zaloUri: string;
  startDate: string;
  releaseDate: string;
  status: string;
  listPosition?: { name: string }[];
  listTechnology?: { name: string }[];
  groupUserRelated?: { name: string }[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetProjectResponse = PaginationResponse<Project>;
