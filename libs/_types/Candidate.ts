import { PaginationResponse } from "@/libs/types";

export type Candidate = {
  avatar: string;
  studentCode: string;
  fullName: string;
  doB: string;
  universityEmail: string;
  personalEmail: string;
  phoneNumber: string;
  phoneNumberRelative: string;
  address: string;
  gender: string;
  major: string;
  gpa: number;
  englishLevel: string;
  cvUri: string;
  desiredPosition: string;
  status: string;
  startDate: string;
  endDate: string;
  internPeriodViewModel: {
    name: string;
    startDate: string;
    endDate: string;
    internshipDuration: number;
    description: string;
    maxCandidateQuantity: number;
    currentUniversityQuantity: number;
    currentCandidateQuantity: number;
    status: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };
  universityViewModel: {
    image: string;
    name: string;
    abbreviation: string;
    address: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetCandidatePaginationResponse = PaginationResponse<Candidate>;
