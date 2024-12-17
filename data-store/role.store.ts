import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";

interface Role {
  id: string;
  name: string;
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

export function useRole(params: { pageSize: number }) {
  const [pageIndex, setPageIndex] = useState(1);

  const [search, setSearch] = useState("");

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["roles", pageIndex, params.pageSize, search],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<Role>>(
        API_ENDPOINTS.role,
        {
          params: new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: params.pageSize.toString(),
            Search: search,
          }),
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Role>;

        return {
          roles: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
          hasNext: data.hasNext,
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
  };
}
