"use client";
import React from "react";
import ProjectCard from "./ProjectCard";
import { cn } from "@nextui-org/theme";
import { Pagination } from "@nextui-org/pagination";
import { useQuery } from "@tanstack/react-query";
import APIClient from "@/libs/api-client";
import { apiEndpoints } from "@/libs/config";
import { GetProjectResponse, Project } from "../_types/Project";
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
  const num_items_show = props.isShowFilter ? 4 : 6;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      // const response = await apiClient.get<GetProjectResponse>(
      //   apiEndpoints.project,
      // );

      // if (response?.statusCode === "200") {
      //   const { data } = response as PaginationResponseSuccess<Project>;

      //   return data.pagingData;
      // }

      // return [];

      return [...Array(num_items_show)].map(() => ({
        title: "System A",
        productUri: "system-a.com",
        zaloUri: "zalo.com/system-a",
        startDate: "2024-11-08",
        releaseDate: "2024-11-08",
        status: "Open",
        listPosition: [
          { name: "Backend Developer" },
          { name: "Frontend Developer" },
        ],
        listTechnology: [
          { name: "React" },
          { name: "NodeJS" },
          { name: "MongoDB" },
        ],
        groupUserRelated: [
          { name: "John Doe", role: "Leader" },
          { name: "Jane Doe", role: "Member" },
        ],
        id: "a59dfe28-94b5-492a-8738-bb298c6afa61",
        dateCreate: "2024-11-08T14:05:15.501Z",
        dateUpdate: "2024-11-08T14:05:15.501Z",
        isDeleted: false,
      }));
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
          data?.map((project) => <ProjectCard key={project.id} {...project} />)
        )}
      </div>
      <Pagination showControls total={10} initialPage={1} />
    </div>
  );
}
