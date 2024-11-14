"use client";
import React from "react";
import ProjectCard from "./ProjectCard";
import { cn } from "@nextui-org/theme";
import { Pagination } from "@nextui-org/pagination";
import { useQuery } from "@tanstack/react-query";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { GetProjectsResponse, Project } from "../_types/Project";
import { PaginationResponseSuccess } from "@/libs/types";

export type ProjectListProps = {
  className?: string;
  isShowFilter?: boolean;
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    // console.error(error);
    // return Promise.reject(error);

    console.log(error.response.data);
  },
});

export default function ProjectList(props: ProjectListProps) {
  const [pageIndex, setPageIndex] = React.useState(1);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["projects", pageIndex],
    queryFn: async () => {
      const response = await apiClient.get<GetProjectsResponse>(
        API_ENDPOINTS.project,
        {
          params: new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: "6",
          }),
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Project>;

        return {
          projects: data.pagingData,
          totalPages: data.totalPages,
        };
      }
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={cn(
          "grid w-full grid-cols-3 gap-x-8 gap-y-4",
          props.className,
          props.isShowFilter ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {isLoading && data ? (
          <div>Loading...</div>
        ) : (
          data?.projects.map((project) => (
            <ProjectCard key={project.id} {...project} refetch={refetch} />
          ))
        )}
      </div>
      <Pagination
        isCompact
        loop
        showControls
        total={Number(data?.totalPages) || 1}
        initialPage={1}
        onChange={(page) => {
          setPageIndex(page);
        }}
      />
    </div>
  );
}
