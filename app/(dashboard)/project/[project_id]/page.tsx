"use client";
import APIClient from "@/libs/api-client";
import GeneralInformation from "./_components/GeneralInformation";
import RelatedUsers from "./_components/RelatedUsers";
import TaskList from "./_components/TaskList";
import ProjectDetailProvider from "../_providers/ProjectDetailProvider";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export type RelatedUser = {
  id: string;
  fullName: string;
  role: string;
};

export default function ProjectDetailsPage() {
  return (
    <ProjectDetailProvider>
      <div className="flex h-full w-full flex-col p-9">
        <h1 className="text-left text-2xl font-semibold capitalize text-black">
          Project Details
        </h1>

        <div className="flex flex-col gap-6">
          <div className="flex w-full gap-6">
            <GeneralInformation />

            <RelatedUsers />
          </div>

          <TaskList />
        </div>
      </div>
    </ProjectDetailProvider>
  );
}
