"use client";

import {
  InterviewDetailFilter,
  useInterviewDetail,
  useRescheduleDetail,
} from "@/data-store/interview/interview-detail";
import { createContext, useContext } from "react";

type InterviewDetails = {
  id: string;
  title: string;
  interviewDate: string;
  startTime: string;
  timeDuration: string;
  interviewFormat: string;
  interviewLocation: string;
  interviewerName: any;
  interviewerId: string;
  interviewScheduleDetails: {
    candidateId: string;
    candidateName: string;
    candidateUniversityEmail: string;
    interviewDate: string;
    startTime: string;
    timeDuration: string;
    status: string;
  }[];
};
export interface InterviewDetailContextInterface {
  isInterviewDetailLoading: boolean;
  interviewDetailData: InterviewDetails | null | undefined;
  refetchInterviewDetail: () => void;
  filter: InterviewDetailFilter;
  setFilter: (newFilter: InterviewDetailFilter | null) => void;
  removeOneFilter: (key: keyof InterviewDetailFilter) => void;
  removeAllFilter: () => void;

  rescheduleDetailData: InterviewDetails | null | undefined;
  isRescheduleDetailLoading: boolean;
  refetchRescheduleDetail: () => void;
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

  const {
    data: rescheduleDetailData,
    isLoading: isRescheduleDetailLoading,
    refetch: refetchRescheduleDetail,
  } = useRescheduleDetail(interviewScheduleId);

  return (
    <InterviewDetailContext.Provider
      value={{
        isInterviewDetailLoading,
        interviewDetailData,
        rescheduleDetailData,
        isRescheduleDetailLoading,
        refetchRescheduleDetail,
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
