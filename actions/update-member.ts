"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export async function updateMember(params: {
  userId: string;
  role: string;
  projectId: string;
}) {
  console.log(params);
  const response = await apiClient.put(
    `${API_ENDPOINTS.project}/${params.projectId}/update-user-related`,
    {
      userId: params.userId,
      role: Number(params.role),
    },
    {},
    true,
  );

  console.log(response);

  return response;
}
