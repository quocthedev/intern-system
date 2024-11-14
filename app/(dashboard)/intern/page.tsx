"use client";
import React, { useState } from "react";
import InternTable from "@/app/(dashboard)/intern/_components/InternTable";
import ActionBar from "./_components/ActionBar";

export default function InternPage() {
  const [selectedInterns, setSelectedInterns] = React.useState(
    new Set<string>([]),
  );

  return (
    <div className="flex h-full w-full flex-col p-6">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Intern management
      </h1>
      <ActionBar selectedInterns={selectedInterns} />
      <InternTable
        selectedInterns={selectedInterns}
        setSelectedInterns={setSelectedInterns}
      />
    </div>
  );
}
