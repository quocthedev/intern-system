"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { cookies } from "next/headers";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);

    return {
      data: {
        error: error.response.data.message,
      },
    };
  },
});
const accessToken = cookies().get("accessToken");

export async function deleteTask(taskId: string) {
  const response = await apiClient.delete(API_ENDPOINTS.task + `/${taskId}`, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${accessToken?.value}`
  });

  return response;
}
