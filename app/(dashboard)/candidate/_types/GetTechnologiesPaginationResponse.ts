import { PaginationResponse } from "@/libs/types";

export type Technology = {
  id: string;
  name: string;
  abbreviation: string;
  imageUri: string;
  description: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetTechnologiesPaginationResponse = PaginationResponse<Technology>;
