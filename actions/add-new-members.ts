"use server";

import APIClient from "@/libs/api-client";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export async function addNewMembers(
  projectId: string,
  candidates: { role: number; userId: string }[],
) {
  console.log(candidates);
  const response = await apiClient.post(
    `/project/${projectId}/add-users`,
    candidates,
    {},
    true,
  );

  return response;
}
