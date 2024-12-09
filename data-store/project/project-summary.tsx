import APIClient from "@/libs/api-client";
import {
  BaseResponse,
  BaseResponseSuccess,
  PaginationResponse,
} from "../../libs/types";
import { useQuery } from "@tanstack/react-query";

type User = {
  fullName: string;
  gender: string;
  id: string;
};

export type GroupUserRelated = {
  role: string;
  count: number;
  users: User[];
};

export type Task = {
  note: any;
  title: string;
  summary: string;
  description: string;
  startDate: string;
  dueDate: string;
  priority: string;
  difficulty: number;
  status: string;
  memberName: string;
  memberId: string;
  completionProgress: number;
  progressAssessment: number;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type ProjectSummary = {
  title: string;
  productUri: string;
  zaloUri: string;
  startDate: string;
  releaseDate: string;
  status: string;
  groupUserRelated: GroupUserRelated[];
  listPosition: { name: string; id: string; abbreviation: string }[];
  listTechnology: { name: string; id: string; abbreviation: string }[];
  taskList: Task[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export function useProjectSummary(params: { projectId: string }) {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["project-summary", params.projectId],
    queryFn: async () => {
      const response = (await apiClient.get<BaseResponse<ProjectSummary>>(
        `/project/${params.projectId}/summary-details`,
      )) as BaseResponseSuccess<ProjectSummary>;

      if (response?.statusCode === "200") {
        return response.data;
      }

      return null;
    },
  });

  return {
    isLoading,
    error,
    data,
    refetch,
  };
}
