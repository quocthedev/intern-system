"use client";
import React from "react";
import InternTable from "@/app/(dashboard)/intern/_components/InternTable";
import ActionBar from "./_components/ActionBar";

export default function InternPage() {
  const [selectedInterns, setSelectedInterns] = React.useState(
    new Set<{
      id: string;
      fullName: string;
    }>([]),
  );

  return (
    <div className="flex h-full w-full flex-col p-6">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Intern management
      </h1>
      <ActionBar selectedInterns={selectedInterns} />
      <InternTable setSelectedInterns={setSelectedInterns} />
    </div>
  );
}
