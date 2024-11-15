"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export async function deleteTask(taskId: string) {
  const response = await apiClient.delete(API_ENDPOINTS.task + `/${taskId}`);

  return response;
}
