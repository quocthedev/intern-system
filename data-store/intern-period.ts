import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "./../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";

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

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export function useInternPeriod(params: { pageSize: number }) {
  const [pageIndex, setPageIndex] = useState(1);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["university", pageIndex, params.pageSize],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<InternPeriod>>(
        API_ENDPOINTS.internPeriod,
        {
          params: new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: params.pageSize.toString(),
          }),
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
  };
}
