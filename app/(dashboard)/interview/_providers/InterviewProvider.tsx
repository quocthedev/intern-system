"use client";
import { InterviewFilter, useInterview } from "@/data-store/interview";
import { createContext, useContext } from "react";

export interface InterviewContextInterface {
  setInterviewPageIndex: (pageIndex: number) => void;
  isListInterviewLoading: boolean;
  listInterviewData:
    | {
        interviews: {
          id: string;
          title: string;
          interviewDate: string;
          startTime: string;
          timeDuration: string;
          interviewFormat: string;
          interviewLocation: string;
          createdByUserId: string;
          interviewerId: string;
          createdByUser: any;
          interviewer: any;
          numberOfNotYetInvitations: number;
          numberOfConfirmedInvitations: number;
          numberOfInvitationsDeclined: number;
        }[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined
    | null;
  refetchListInterview: () => void;
  setSearch: (search: string) => void;
  filter: InterviewFilter;
  setFilter: (newFilter: InterviewFilter | null) => void;
  removeOneFilter: (key: keyof InterviewFilter) => void;
  removeAllFilter: () => void;
}

const InterviewContext = createContext<InterviewContextInterface>(
  {} as InterviewContextInterface,
);

export const useInterviewContext = () => useContext(InterviewContext);

export default function InterviewProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isListInterviewLoading,
    data: listInterviewData,
    refetch: refetchListInterview,
    setPageIndex: setInterviewPageIndex,

    setSearch,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  } = useInterview({
    pageSize: 6,
  });

  return (
    <InterviewContext.Provider
      value={{
        isListInterviewLoading,
        listInterviewData,
        refetchListInterview,
        setInterviewPageIndex,
        setSearch,
        filter: filter as InterviewFilter,
        setFilter,
        removeOneFilter,
        removeAllFilter,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
