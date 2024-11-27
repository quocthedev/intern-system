"use client";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

interface InterViewScheduleInterface {
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
}

const InterviewContext = createContext<{
  interviewPageId: number;
  setInterviewPageId: (pageId: number) => void;
  isListInterviewLoading: boolean;
  listInterviewData:
    | {
        interviewSchedules: InterViewScheduleInterface[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined;
  refetchListInterview: () => void;
} | null>(null);

export const useInterviewContext = () => useContext(InterviewContext);

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export default function InterviewProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [interviewPageId, setInterviewPageId] = useState(1);

  const pageSize = 6;

  const {
    isLoading: isListInterviewLoading,
    data: listInterviewData,
    refetch: refetchListInterview,
  } = useQuery({
    queryKey: ["interviewSchedule", interviewPageId, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<InterViewScheduleInterface>
      >(API_ENDPOINTS.interviewSchedule, {
        params: new URLSearchParams({
          PageIndex: interviewPageId.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<InterViewScheduleInterface>;

        return {
          interviewSchedules: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });

  return (
    <InterviewContext.Provider
      value={{
        interviewPageId,
        setInterviewPageId,
        isListInterviewLoading,
        listInterviewData,
        refetchListInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}
