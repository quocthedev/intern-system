import APIClient from "@/libs/api-client";
import {
  PaginationResponse,
  PaginationResponseSuccess,
} from "../../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";
import { toast } from "sonner";
import { getCookie } from "@/app/util";

export enum CandidateStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  InterviewEmailSent = 3,
  CompletedOJT = 4,
  Out = 5,
}

export interface UniversityCandidate {
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
}

export type UniversityCandidateFilter = Partial<{
  Status: string;
  Gender: string;
}>;

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

const accessToken = getCookie("accessToken");

const useFilterStore = create<{
  filter: UniversityCandidateFilter | null;
  setFilter: (newFilter: UniversityCandidateFilter | null) => void;
  removeOneFilter: (key: keyof UniversityCandidateFilter) => void;
  removeAllFilter: () => void;
}>((set) => ({
  filter: null,
  setFilter: (newFilter: UniversityCandidateFilter | null) => {
    if (!newFilter) {
      toast.error("Please select at least one filter");

      return;
    }

    set({ filter: newFilter });
  },
  removeOneFilter: (key: keyof UniversityCandidateFilter) =>
    set((state) => {
      const newFilter = { ...state.filter };

      delete newFilter[key];

      return { filter: newFilter };
    }),

  removeAllFilter: () => set({ filter: null }),
}));

export function useUniversityCandidate(params: {
  pageSize: number;
  internPeriodId: string | undefined;
  universityId: string | undefined;
  status?: CandidateStatus;
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");

  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useFilterStore();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [
      "universityCandidate",
      pageIndex,
      params.pageSize,
      search,
      params.status,
      filter,
    ],
    queryFn: async () => {
      if (!params.internPeriodId || !params.universityId) {
        return null;
      }

      //Change code for filtering interview-schedule candidate with approved status
      const queryParams: Record<string, string> = {
        PageIndex: pageIndex.toString(),
        PageSize: params.pageSize.toString(),
        ...(search && { Search: search }),
        ...(params.status && { Status: params.status.toString() }),
        ...(filter ?? {}),
      };

      const response = await apiClient.get<
        PaginationResponse<UniversityCandidate>
      >(
        `${API_ENDPOINTS.candidate}/${params.internPeriodId}/university/${params.universityId}/candidates`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          params: new URLSearchParams(queryParams),
        },
      );

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<UniversityCandidate>;

        return {
          candidates: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }

      return null;
    },
  });

  return {
    isLoading,
    error,
    data,
    refetch,
    setPageIndex,
    setSearch,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  };
}
