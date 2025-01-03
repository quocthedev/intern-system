"use client";
import React from "react";
import ActionBar from "./_components/ActionBar";
import ProjectList from "./_components/ProjectList";
import ProjectListProvider from "@/app/(dashboard)/projectCandidate/_providers/ProjectListProvider";

export default function ProjectPage() {
  return (
    <ProjectListProvider>
      <div className="flex h-full w-full flex-col p-6">
        <div className="mb-3 text-xl font-semibold">Project assgined</div>
        <ActionBar />
        <div className="flex w-full gap-6">
          <ProjectList />
        </div>
      </div>
    </ProjectListProvider>
  );
}
