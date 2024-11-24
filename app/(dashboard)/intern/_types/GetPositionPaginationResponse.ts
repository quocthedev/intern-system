import { PaginationResponse } from "@/libs/types";

export type Technology = {
  name: string;
  description: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type Position = {
  image: string;
  name: string;
  abbreviation: string;
  description: string;
  tenologies: Technology[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetPositionPaginationResponse = PaginationResponse<Position>;
