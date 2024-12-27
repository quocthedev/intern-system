import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "./../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";
import { toast } from "sonner";

interface InternPeriod {
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
}

export type InternPeriodFilter = Partial<{
  FromDate: string;
  ToDate: string;
  Status: string;
}>;

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

// Make sure the filter is valid
const validate = (filter: InternPeriodFilter) => {
  if (filter.FromDate && filter.ToDate && filter.FromDate !== filter.ToDate) {
    const fromDate = new Date(filter.FromDate);
    const toDate = new Date(filter.ToDate);

    return fromDate < toDate;
  }

  return true;
};

const useFilterStore = create<{
  filter: InternPeriodFilter | null;
  setFilter: (newFilter: InternPeriodFilter | null) => void;
  removeOneFilter: (key: keyof InternPeriodFilter) => void;
  removeAllFilter: () => void;
}>((set) => ({
  filter: null,
  setFilter: (newFilter: InternPeriodFilter | null) => {
    if (!newFilter) {
      toast.error("Please select at least one filter");

      return;
    }

    if (newFilter && !validate(newFilter)) {
      toast.error("From date must be less than To Date");

      return;
    }
    set({ filter: newFilter });
  },
  removeOneFilter: (key: keyof InternPeriodFilter) =>
    set((state) => {
      const newFilter = { ...state.filter };

      delete newFilter[key];

      return { filter: newFilter };
    }),

  removeAllFilter: () => set({ filter: null }),
}));

export function useInternPeriod(params: { pageSize: number }) {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");

  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useFilterStore();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["university", pageIndex, params.pageSize, search, filter],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<InternPeriod>>(
        API_ENDPOINTS.internPeriod,
        {
          params: new URLSearchParams(
            Object.assign(
              {
                PageIndex: pageIndex.toString(),
                PageSize: params.pageSize.toString(),
                Search: search,
              },
              filter ?? {},
            ),
          ),
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<InternPeriod>;

        return {
          periods: data.pagingData,
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
