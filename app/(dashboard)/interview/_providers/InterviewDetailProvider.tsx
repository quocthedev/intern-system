"use client";

import {
  InterviewDetailFilter,
  useInterviewDetail,
} from "@/data-store/interview/interview-detail";
import { createContext, useContext } from "react";

export interface InterviewDetailContextInterface {
  isInterviewDetailLoading: boolean;
  interviewDetailData:
    | {
        id: string;
        title: string;
        interviewDate: string;
        startTime: string;
        timeDuration: string;
        interviewFormat: string;
        interviewLocation: string;
        interviewerName: any;
        interviewScheduleDetails: {
          candidateId: string;
          candidateName: string;
          candidateUniversityEmail: string;
          interviewDate: string;
          startTime: string;
          timeDuration: string;
          status: string;
        }[];
      }
    | null
    | undefined;
  refetchInterviewDetail: () => void;
  filter: InterviewDetailFilter;
  setFilter: (newFilter: InterviewDetailFilter | null) => void;
  removeOneFilter: (key: keyof InterviewDetailFilter) => void;
  removeAllFilter: () => void;
}

const InterviewDetailContext = createContext<InterviewDetailContextInterface>(
  {} as InterviewDetailContextInterface,
);

export const useInterviewDetailContext = () =>
  useContext(InterviewDetailContext);

interface InterviewDetailProviderProps {
  interviewScheduleId: Object;
  children: React.ReactNode;
}

export default function InterviewDetailProvider({
  interviewScheduleId,
  children,
}: InterviewDetailProviderProps) {
  const {
    isLoading: isInterviewDetailLoading,
    data: interviewDetailData,
    refetch: refetchInterviewDetail,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  } = useInterviewDetail(interviewScheduleId);

  return (
    <InterviewDetailContext.Provider
      value={{
        isInterviewDetailLoading,
        interviewDetailData,
        refetchInterviewDetail,
        filter,
        setFilter,
        removeOneFilter,
        removeAllFilter,
      }}
    >
      {children}
    </InterviewDetailContext.Provider>
  );
}
