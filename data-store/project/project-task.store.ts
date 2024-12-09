import APIClient from "@/libs/api-client";
import {
  PaginationResponse,
  PaginationResponseSuccess,
} from "../../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";
import { toast } from "sonner";

export interface ProjectTask {
  title: string;
  summary: string;
  startDate: string;
  dueDate: string;
  priority: string;
  difficulty: string;
  status: string;
  completionProgress: number;
  progressAssessment: number;
  assignedPerson: {
    assignedPerson: string;
    position: string;
    rank: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
}

export type ProjectTaskFilter = Partial<{
  Status: string;
  PositionId: string;
  UserId: string;
  Priority: string;
  Difficulty: string;
}> | null;

export type ProjectTaskData =
  | {
      tasks: ProjectTask[];
      pageIndex: number;
      totalPages: number;
    }
  | null
  | undefined;

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

const useFilterStore = create<{
  filter: ProjectTaskFilter | null;
  setFilter: (newFilter: ProjectTaskFilter | null) => void;
  removeOneFilter: (key: keyof ProjectTaskFilter) => void;
  removeAllFilter: () => void;
}>((set) => ({
  filter: null,
  setFilter: (newFilter: ProjectTaskFilter | null) => {
    set({ filter: newFilter });
  },
  removeOneFilter: (key: keyof ProjectTaskFilter) =>
    set((state) => {
      const newFilter = { ...state.filter };

      delete newFilter[key];

      return { filter: newFilter };
    }),

  removeAllFilter: () => set({ filter: null }),
}));

export function useProjectTask(params: {
  pageSize: number;
  projectId: string;
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");

  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useFilterStore();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["project-task", pageIndex, params.pageSize, search, filter],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<ProjectTask>>(
        `${API_ENDPOINTS.project}/${params.projectId}/tasks`,
        {
          params: new URLSearchParams(
            Object.assign(
              {
                PageIndex: pageIndex.toString(),
                PageSize: params.pageSize.toString(),
                Search: search,
              },
              filter ?? {},
            ),
          ),
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<ProjectTask>;

        return {
          tasks: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }

      return null;
    },
  });

  return {
    isLoading,
    error,
    data,
    refetch,
    setPageIndex,
    setSearch,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  };
}
