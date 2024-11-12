"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    // console.error(error);
    // return Promise.reject(error);

    console.log(error.response.data);
  },
});

export async function createNewProject(
  data: FormData,
): Promise<boolean | null> {
  const params = {
    title: data.get("title") as string,
    productUri: data.get("productUri") as string,
    zaloUri: data.get("zaloUri") as string,
    positions: data.getAll("positions").map((id) => ({
      positionId: id,
    })),
    technologies: data.getAll("technologies") as string[],
    startDate: new Date(
      data.get("startDate")?.toString().split("+")[0] as string,
    ).toISOString(),
    releaseDate: new Date(
      data.get("releaseDate")?.toString().split("+")[0] as string,
    ).toISOString(),
  };

  await apiClient.post(API_ENDPOINTS.project, params, {}, true);

  return true;
}
