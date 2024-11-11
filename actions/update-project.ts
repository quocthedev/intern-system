"use server";

import { Project } from "@/app/(dashboard)/project/_types/Project";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { update } from "ramda";
import * as R from "ramda";
const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    // console.error(error);
    // return Promise.reject(error);

    console.log(error.response);
  },
});

export async function updateProject(params: {
  projectId: string;
  updateData: Partial<
    Project & {
      addingPositions: string[];
      removingPositions: string[];
      addingTechnologies: string[];
      removingTechnologies: string[];
    }
  >;
}) {
  const {
    addingPositions,
    removingPositions,
    addingTechnologies,
    removingTechnologies,
    ...updateProjectParams
  } = params.updateData;

  const requestBody = {
    ...updateProjectParams,
    ...(R.compose(
      R.fromPairs,
      R.map(([key, value]) => [key, new Date(value).toISOString()]) as never,
      R.toPairs as never,
      R.pick(["startDate", "releaseDate"]) as never,
    )(updateProjectParams) as any),
  };

  const requests = [];

  if (addingPositions) {
    requests.push(
      apiClient.post(
        API_ENDPOINTS.project + `/${params.projectId}/add-positions`,
        addingPositions.map((id) => ({ positionId: id })),
      ),
    );
  }

  if (removingPositions) {
    requests.push(
      removingPositions.map((id) =>
        apiClient.delete(
          API_ENDPOINTS.project + `/${params.projectId}/position/${id}`,
        ),
      ),
    );
  }

  if (addingTechnologies) {
    requests.push(
      apiClient.post(
        API_ENDPOINTS.project + `/${params.projectId}/add-technologies`,
        addingTechnologies.map((id) => ({ technologyId: id })),
      ),
    );
  }

  if (removingTechnologies) {
    removingTechnologies.map((id) =>
      apiClient.delete(
        API_ENDPOINTS.project + `/${params.projectId}/technology/${id}`,
      ),
    );
  }

  const response = await Promise.all([
    apiClient.put(API_ENDPOINTS.project + `/${params.projectId}`, requestBody),
    ...requests,
  ]);

  return response;
}
