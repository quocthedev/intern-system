import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "./../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";

interface UniversityInterface {
  id: string;
  name: string;
  abbreviation: string;
  address: string;
  image: string;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export function useUniversity(params: { pageSize: number }) {
  const [pageIndex, setPageIndex] = useState(1);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["university", pageIndex, params.pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<UniversityInterface>
      >(API_ENDPOINTS.university, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: params.pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<UniversityInterface>;

        return {
          universitites: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
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
