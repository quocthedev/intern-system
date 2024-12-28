import APIClient from "@/libs/api-client";
import {
  PaginationResponse,
  PaginationResponseSuccess,
} from "../../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";
import { getCookie } from "cookies-next";

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

export type Project = {
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

export type ProjectListFilter = Partial<{
  Status: string;
  FromDate: string;
  ToDate: string;
}> | null;

export type ProjectListData =
  | {
      projects: Project[];
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
  filter: ProjectListFilter | null;
  setFilter: (newFilter: ProjectListFilter | null) => void;
  removeOneFilter: (key: keyof ProjectListFilter) => void;
  removeAllFilter: () => void;
}>((set) => ({
  filter: null,
  setFilter: (newFilter: ProjectListFilter | null) => {
    set({ filter: newFilter });
  },
  removeOneFilter: (key: keyof ProjectListFilter) =>
    set((state) => {
      const newFilter = { ...state.filter };

      delete newFilter[key];

      return { filter: newFilter };
    }),

  removeAllFilter: () => set({ filter: null }),
}));

export function useProjectListCandidate(params: { pageSize: number }) {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const token = getCookie("accessToken");

  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useFilterStore();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [
      "project-list-candidate",
      pageIndex,
      params.pageSize,
      search,
      filter,
    ],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<Project>>(
        API_ENDPOINTS.project + "/user-projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
        const { data } = response as PaginationResponseSuccess<Project>;

        return {
          projects: data.pagingData,
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
