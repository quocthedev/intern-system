import ActionBar from "@/app/(dashboard)/internPeriod/_components/ActionBar";
import InternPeroidTable from "@/app/(dashboard)/internPeriod/_components/InternPeroidTable";
import React from "react";

export default function page() {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Intern period management
      </h1>
      <ActionBar />
      <InternPeroidTable />
    </div>
  );
}
