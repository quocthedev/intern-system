"use client";
import APIClient from "@/libs/api-client";
import GeneralInformation from "./_components/GeneralInformation";
import RelatedUsers from "./_components/RelatedUsers";
import TaskList from "./_components/TaskList";
import ProjectDetailProvider from "../_providers/ProjectDetailProvider";
import Link from "next/link";
import { getCookie } from "@/app/util";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response);
  },
});

export type RelatedUser = {
  id: string;
  fullName: string;
  role: string;
};

const role = getCookie("userRole");

export default function ProjectDetailsPage() {
  return (
    <ProjectDetailProvider>
      <div className="flex h-full w-full flex-col p-6">
        <h1 className="text-left text-2xl font-semibold capitalize text-black">
          Project details
        </h1>

        <div className="flex flex-col">
          <div className="mt-1">
            {role === "Candidate" ? (
              <div className="flex items-center">
                <Link
                  href="/userCandidate/detail"
                  className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Projects assigned list
                </Link>
                <span className="mx-2"> &gt; </span>
                <span className="font-semibold">Project information</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Link
                  href="/project"
                  className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Project management
                </Link>
                <span className="mx-2"> &gt; </span>
                <span className="font-semibold">Project information</span>
              </div>
            )}
          </div>

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
