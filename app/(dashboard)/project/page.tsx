"use client";
import React from "react";
import ActionBar from "./_components/ActionBar";
import ProjectList from "./_components/ProjectList";
import FilterSelector from "./_components/FilterSelector";
import { useToggle } from "usehooks-ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectPage() {
  const [showFilter, toggleShowFilter] = useToggle(false);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-9">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Project management
      </h1>

      <ActionBar toggleShowFilter={toggleShowFilter} />
      <div className="flex w-full gap-6">
        <ProjectList isShowFilter={showFilter} />
        {showFilter && <FilterSelector />}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </div>
  );
}
