import APIClient from "@/libs/api-client";
import { BaseResponse, BaseResponseSuccess } from "./../libs/types";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";

interface UserInterface {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  gender: string;
  phone: string;
  address: string;
  avatar: string;
  status: string;
  lastActivity: string;
  role: {
    name: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };
  jobTitle: {
    positions: string[];
  };
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

export function useUser(params: { userId: string }) {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get<BaseResponse<UserInterface>>(
        `${API_ENDPOINTS.user}/${params.userId}`,
      );

      if (response?.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<UserInterface>;

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
