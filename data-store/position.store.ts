import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";

interface Position {
  name: string;
  abbreviation: string;
  technologies: string[];
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

// create a usePositionStore as a dynamic list of positions
// this list are able to be extended when user scroll down to the bottom of the list

const usePositionStore = create<{
  dynamicPositionList: Position[];
  setPositions: (newPositions: Position[]) => void;
  addPositions: (newPositions: Position[]) => void;
  clearPositions: () => void;
}>((set) => ({
  dynamicPositionList: [],
  setPositions: (newPositions: Position[]) => {
    set({ dynamicPositionList: newPositions });
  },
  addPositions: (newPositions: Position[]) => {
    set((state) => {
      /// Remove duplicated positions before adding new positions

      const newPositionsSet = new Set(newPositions.map((p) => p.id));
      const filteredPositions = state.dynamicPositionList.filter(
        (p) => !newPositionsSet.has(p.id),
      );

      return { dynamicPositionList: [...filteredPositions, ...newPositions] };
    });
  },
  clearPositions: () => {
    set({ dynamicPositionList: [] });
  },
}));

export function usePosition(params: { pageSize: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearchValue] = useState("");

  const { dynamicPositionList, addPositions, clearPositions } =
    usePositionStore();

  const setSearch = (search: string) => {
    clearPositions();
    setPageIndex(1);
    setSearchValue(search);
    refetch();
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["position", pageIndex, params.pageSize, search],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<Position>>(
        API_ENDPOINTS.position,
        {
          params: new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: params.pageSize.toString(),
            Search: search,
          }),
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Position>;

        addPositions(data.pagingData);

        return {
          positions: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
          hasNext: data.hasNext,
        };
      }

      return null;
    },
  });

  const loadMore = () => {
    setPageIndex((prev) => prev + 1);
  };

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: data?.hasNext,
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
    onLoadMore: loadMore,
  });

  return {
    isLoading,
    error,
    data,
    refetch,
    setPageIndex,
    setSearch,
    loadMore,
    dynamicPositionList,
    scrollerRef,
    setIsOpen,
    isOpen,
  };
}
