"use client";
import React from "react";
import ProjectCard from "./ProjectCard";
import { cn } from "@nextui-org/theme";
import { Pagination } from "@nextui-org/pagination";

export type ProjectListProps = {
  className?: string;
  isShowFilter?: boolean;
};
export default function ProjectList(props: ProjectListProps) {
  const num_items_show = props.isShowFilter ? 4 : 6;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        className={cn(
          "grid w-full grid-cols-3 gap-x-8 gap-y-4",
          props.className,
          props.isShowFilter ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {/* {[1, 2, 3, 4, 5, 6].map((item) => (
          <ProjectCard key={item} />
        ))} */}

        {[...Array(num_items_show)].map((_, index) => (
          <ProjectCard key={index} />
        ))}
      </div>
      <Pagination showControls total={10} initialPage={1} />
    </div>
  );
}
