"use server";

import APIClient from "@/libs/api-client";
import { BaseResponse } from "@/libs/types";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

export async function addNewMembers(
  projectId: string,
  candidates: { role: number; userId: string }[],
) {
  console.log(candidates);
  const response = await apiClient.post<BaseResponse<unknown>>(
    `/project/${projectId}/add-users`,
    candidates,
    {},
    true,
  );

  return response;
}
