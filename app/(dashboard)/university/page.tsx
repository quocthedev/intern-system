import ActionBar from "@/app/(dashboard)/university/_components/ActionBar";
import UniversityTable from "@/app/(dashboard)/university/_components/UniversityTable";
import UniversityProvider from "@/app/(dashboard)/university/_providers/UniversityProvider";
import React from "react";

function UniversityPage() {
  return (
    <UniversityProvider>
      <div className="p-6">
        <h1 className="text-left text-2xl font-semibold capitalize text-black">
          University management
        </h1>
        <ActionBar />
        <UniversityTable />
      </div>
    </UniversityProvider>
  );
}

export default UniversityPage;
