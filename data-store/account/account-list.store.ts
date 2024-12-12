import APIClient from "@/libs/api-client";
import {
  PaginationResponse,
  PaginationResponseSuccess,
} from "../../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";

export type Account = {
  fullName: string;
  email: string;
  userName: string;
  gender: string;
  phone: string;
  address: string;
  status: string;
  isActive: boolean;
  roleId: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

export type AccountListFilter = Partial<{}> | null;

export type AccountListData =
  | {
      Accounts: Account[];
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
  filter: AccountListFilter | null;
  setFilter: (newFilter: AccountListFilter | null) => void;
  removeOneFilter: (key: keyof AccountListFilter) => void;
  removeAllFilter: () => void;
}>((set) => ({
  filter: null,
  setFilter: (newFilter: AccountListFilter | null) => {
    set({ filter: newFilter });
  },
  removeOneFilter: (key: keyof AccountListFilter) =>
    set((state) => {
      const newFilter = { ...state.filter };

      delete newFilter[key];

      return { filter: newFilter };
    }),

  removeAllFilter: () => set({ filter: null }),
}));

export function useAccountList(params: { pageSize: number }) {
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");

  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useFilterStore();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["account-list", pageIndex, params.pageSize, search, filter],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<Account>>(
        API_ENDPOINTS.user,
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
        const { data } = response as PaginationResponseSuccess<Account>;

        return {
          accounts: data.pagingData,
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
