export type Criteria = {
  content: string;
  percent: number;
  maxScore: number;
  evaluateScore: number;
  finalScore: number;
  notes: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type SubmitScore = {
  complianceCriteriaId: string;
  evaluateScore: number;
  notes: string;
};
