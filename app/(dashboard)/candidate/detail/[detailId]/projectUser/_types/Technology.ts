import { PaginationResponse } from "@/libs/types";

export type Technology = {
  name: string;
  abbreviation: string;
  imageUri: string;
  description: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetTechnologyResponse = PaginationResponse<Technology>;
