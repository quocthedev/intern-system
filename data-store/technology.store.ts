import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "../libs/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { API_ENDPOINTS } from "@/libs/config";
import { create } from "zustand";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { getCookie } from "@/app/util";

interface Technology {
  id: string;
  name: string;
  abbreviation: string;
  imageUri: string;
  description: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return error.response.data;
  },
});

const accessToken = getCookie("accessToken");

// create a useTechnologyStore as a dynamic list of Technologys
// this list are able to be extended when user scroll down to the bottom of the list

const useTechnologyStore = create<{
  dynamicTechnologyList: Technology[];
  setTechnologies: (newTechnologies: Technology[]) => void;
  addTechnologies: (newTechnologies: Technology[]) => void;
  clearTechnologies: () => void;
}>((set) => ({
  dynamicTechnologyList: [],
  setTechnologies: (newTechnologies: Technology[]) => {
    set({ dynamicTechnologyList: newTechnologies });
  },
  addTechnologies: (newTechnologies: Technology[]) => {
    set((state) => {
      /// Remove duplicated technologies before adding new technologies

      const newTechnologiesSet = new Set(newTechnologies.map((p) => p.id));
      const filteredTechnologies = state.dynamicTechnologyList.filter(
        (p) => !newTechnologiesSet.has(p.id),
      );

      return {
        dynamicTechnologyList: [...filteredTechnologies, ...newTechnologies],
      };
    });
  },
  clearTechnologies: () => {
    set({ dynamicTechnologyList: [] });
  },
}));

export function useTechnology(params: { pageSize: number }) {
  const [isOpen, setIsOpen] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearchValue] = useState("");

  const {
    dynamicTechnologyList,
    addTechnologies: addTechnologies,
    clearTechnologies: clearTechnologies,
  } = useTechnologyStore();

  const setSearch = (search: string) => {
    clearTechnologies();
    setPageIndex(1);
    setSearchValue(search);
    refetch();
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["technologies", pageIndex, params.pageSize, search],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<Technology>>(
        API_ENDPOINTS.technology,
        {
          params: new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: params.pageSize.toString(),
            Search: search,
          }),
          headers: {
            Authorization:`Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Technology>;

        addTechnologies(data.pagingData);

        return {
          technologies: data.pagingData,
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
    dynamicTechnologyList,
    scrollerRef,
    setIsOpen,
    isOpen,
  };
}
