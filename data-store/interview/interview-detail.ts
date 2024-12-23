import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { create } from "zustand";

interface InterViewScheduleDetail {
  id: string;
  title: string;
  interviewDate: string;
  startTime: string;
  timeDuration: string;
  interviewFormat: string;
  interviewLocation: string;
  interviewerName: any;
  interviewScheduleDetails: CandidateInterviewDetail[];
}

interface CandidateInterviewDetail {
  candidateId: string;
  candidateName: string;
  candidateUniversityEmail: string;
  interviewDate: string;
  startTime: any;
  timeDuration: any;
  status: string;
}

export type InterviewDetailFilter = Partial<{
  Status: string;
}> | null; // Make filter status optional

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

const useFilterStore = create<{
  filter: InterviewDetailFilter | null;
  setFilter: (newFilter: InterviewDetailFilter | null) => void;
  removeOneFilter: (key: keyof InterviewDetailFilter) => void;
  removeAllFilter: () => void;
}>((set) => ({
  filter: null,
  setFilter: (newFilter: InterviewDetailFilter | null) => {
    if (!newFilter) {
      toast.error("Please select at least one filter");

      return;
    }
    set({ filter: newFilter });
  },
  removeOneFilter: (key: keyof InterviewDetailFilter) =>
    set((state) => {
      const newFilter = { ...state.filter };

      delete newFilter[key];
      
      return { filter: newFilter };
    }),
  removeAllFilter: () => set({ filter: null }),
}));

export function useInterviewDetail(interviewScheduleId: Object) {
  const { filter, setFilter, removeOneFilter, removeAllFilter } = useFilterStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["interviewDetail", interviewScheduleId, filter],
    queryFn: async () => {
      const response = await apiClient.get<{
        data: InterViewScheduleDetail; // Assume that the response contains a "data" field
      }>(
        `${API_ENDPOINTS.interviewSchedule}/${interviewScheduleId}/interschedule-details`,
        {
          params: filter ?? {},
        }
      );

      return response.data; // Access the 'data' field here
    },
  });

  return {
    isLoading,
    data,
    refetch,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  };
}
