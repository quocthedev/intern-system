"use server";

import { useProjectListContext } from "@/app/(dashboard)/project/_providers/ProjectListProvider";
import APIClient from "@/libs/api-client";

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


export async function DeleteProject(projectId: string) {
  const response = await apiClient.delete(`/project/${projectId}`);

  return response;

}
