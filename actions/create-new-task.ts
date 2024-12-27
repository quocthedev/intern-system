"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";

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

export async function createNewTask(formData: FormData) {
  const title = formData.get("title")?.toString();
  const summary = formData.get("summary")?.toString();
  const description = formData.get("description")?.toString();
  const startDate = formData.get("startDate")?.toString().split("T")[0];
  const dueDate = formData.get("dueDate")?.toString().split("T")[0];
  const priority = Number(formData.get("priority")?.toString());
  const difficulty = Number(formData.get("difficulty")?.toString());
  const userId = formData.get("userId")?.toString();
  const projectId = formData.get("projectId")?.toString();
  const positionId = formData.get("positionId")?.toString();
  const params = {
    title,
    summary,
    description,
    startDate,
    dueDate,
    priority,
    difficulty,
    userId,
    projectId,
    positionId,
  };

  const response = await apiClient.post(API_ENDPOINTS.task, params);

  return response;
}
