import { PaginationResponse } from "@/libs/types";

export type Position = {
  name: string;
  abbreviation: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetPositionResponse = PaginationResponse<Position>;
