export type CandidateUser = {
  fullName: string;
  email: string;
  gender: string;
  phone: string;
  status: string;
  position: string;
  rank: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type GetCandidateUsersResponse = {
  statusCode: "200";
  data: CandidateUser[];
};
