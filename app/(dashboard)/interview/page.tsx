import ActionBar from "@/app/(dashboard)/interview/_component/ActionBar";
import InterViewCard from "@/app/(dashboard)/interview/_component/InterViewCard";
import React from "react";
import InterviewProvider from "./_providers/InterviewProvider";

export default function InterviewPage() {
  return (
    <InterviewProvider>
      <div className="flex h-full w-full flex-col p-6">
        <h1 className="text-left text-2xl font-semibold capitalize text-black">
          Interview Schedules management
        </h1>
        <ActionBar />
        <InterViewCard />
      </div>
    </InterviewProvider>
  );
}
