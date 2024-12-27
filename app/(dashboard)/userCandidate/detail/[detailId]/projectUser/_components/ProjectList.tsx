"use client";
import React from "react";
import ProjectCard from "./ProjectCard";
import { cn } from "@nextui-org/react";
import { Pagination } from "@nextui-org/pagination";
import { useProjectListContext } from "../_providers/ProjectListProvider";
import Loading from "@/components/Loading";

export type ProjectListProps = {
  className?: string;
  isShowFilter?: boolean;
};

export default function ProjectList(props: ProjectListProps) {
  const { isLoadingProjectList, projectList, setProjectListPageIndex } =
    useProjectListContext();

  if (isLoadingProjectList) {
    return <Loading />;
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={cn(
          "grid w-full grid-cols-3 gap-x-8 gap-y-4",
          props.className,
          props.isShowFilter ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {projectList?.projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
      <Pagination
        isCompact
        loop
        showControls
        total={Number(projectList?.totalPages) || 1}
        initialPage={1}
        onChange={(page) => {
          setProjectListPageIndex(page);
        }}
      />
    </div>
  );
}
