import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { BaseResponse, BaseResponseSuccess } from "@/libs/types";
import { useQuery } from "@tanstack/react-query";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export type InternPeriod = {
  name: string;
  startDate: string;
  endDate: string;
  internshipDuration: number;
  description: string;
  maxCandidateQuantity: number;
  currentUniversityQuantity: number;
  currentCandidateQuantity: number;
  status: string;
  universities: {
    name: string;
    abbreviation: string;
    address: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  }[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export function useInternPeriodDetail(params: { id: string }) {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["internPeriod"],
    queryFn: async () => {
      const response = await apiClient.get<BaseResponse<InternPeriod>>(
        `${API_ENDPOINTS.internPeriod}/${params.id}/universities`,
      );

      if (response?.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<InternPeriod>;

        return data;
      }

      return null;
    },
  });

  return {
    isLoading,
    error,
    data,
    refetch,
  };
}
