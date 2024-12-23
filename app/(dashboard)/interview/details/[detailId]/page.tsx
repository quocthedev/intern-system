"use client";
import InterviewDetailProvider from "@/app/(dashboard)/interview/_providers/InterviewDetailProvider";
import InterViewDetailPage from "@/app/(dashboard)/interview/details/[detailId]/InterViewDetail";
import { useParams } from "next/navigation";
import React from "react";

export default function SchedulePage() {
  const { detailId } = useParams();

  return (
    <InterviewDetailProvider interviewScheduleId={detailId}>
      <div className="flex h-full w-full flex-col p-6">
        <h1 className="mb-4 text-left text-2xl font-semibold capitalize text-black">
          Interview Schedules Details
        </h1>
        <InterViewDetailPage />
      </div>
    </InterviewDetailProvider>
  );
}
