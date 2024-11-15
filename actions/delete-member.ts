"use server";

import APIClient from "@/libs/api-client";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export async function deleteMember(projectId: string, memberId: string) {
  const response = await apiClient.delete(
    `/project/${projectId}/related-user/${memberId}`,
    {},
  );

  return response;
}
