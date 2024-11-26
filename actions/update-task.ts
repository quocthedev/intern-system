"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import * as R from "ramda";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response);
  },
});

export async function updateTask(formData: FormData) {
  const title = formData.get("title")?.toString() ?? null;
  const summary = formData.get("summary")?.toString() ?? null;
  const description = formData.get("description")?.toString() ?? null;
  const startDate = formData.get("startDate")?.toString().split("T")[0] ?? null;
  const dueDate = formData.get("dueDate")?.toString().split("T")[0] ?? null;
  const priority = Number(formData.get("priority")?.toString()) ?? null;
  const difficulty = Number(formData.get("difficulty")?.toString()) ?? null;
  const status = Number(formData.get("status")?.toString()) ?? null;
  const completionProgress =
    Number(formData.get("completionProgress")?.toString()) ?? null;
  const progressAssessment =
    Number(formData.get("progressAssessment")?.toString()) ?? null;
  const userId = formData.get("userId")?.toString() ?? null;
  const projectId = formData.get("projectId")?.toString() ?? null;
  const taskId = formData.get("taskId")?.toString() ?? null;

  const params = R.compose(
    R.fromPairs,
    R.reject(([_, value]) => value === null) as never,
    R.toPairs as never,
  )({
    title,
    summary,
    description,
    priority,
    difficulty,
    userId,
    projectId,
    status,
    completionProgress,
    progressAssessment,
    startDate: startDate ? new Date(startDate).toISOString() : null,
    dueDate: dueDate ? new Date(dueDate).toISOString() : null,
  });

  const response = await apiClient.put(
    `${API_ENDPOINTS.task}/${taskId}`,
    params,
    {},
    true,
  );

  return true;
}
