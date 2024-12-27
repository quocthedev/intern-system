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

export async function deleteMember(projectId: string, memberId: string) {
  const response = await apiClient.delete<BaseResponse<unknown>>(
    `/project/${projectId}/related-user/${memberId}`,
    {},
  );

  return response;
}
