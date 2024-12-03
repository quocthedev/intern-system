import InterViewDetailPage from "@/app/(dashboard)/interview/details/[detailId]/InterViewDetail";
import React from "react";

export default function SchedulePage() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <h1 className="mb-4 text-left text-2xl font-semibold capitalize text-black">
        Interview Schedules Details
      </h1>
      <InterViewDetailPage />
    </div>
  );
}
