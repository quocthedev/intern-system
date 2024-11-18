import { PaginationResponse } from "@/libs/types";

type User = {
  fullName: string;
  gender: string;
  id: string;
};

export type GroupUserRelated = {
  role: string;
  count: number;
  users: User[];
};

export type Task = {
  title: string;
  summary: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: string;
  difficulty: number;
  status: string;
  memberName: string;
  memberId: string;
  completionProgress: number;
  progressAssessment: number;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type Project = {
  title: string;
  productUri: string;
  zaloUri: string;
  startDate: string;
  releaseDate: string;
  status: string;
  groupUserRelated: GroupUserRelated[];
  listPosition: { name: string; id: string }[];
  listTechnology: { name: string; id: string }[];
  taskList: Task[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetProjectsResponse = PaginationResponse<Project>;

export type GetProjectResponse = {
  statusCode: "200";
  data: Project;
};
