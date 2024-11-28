import React from "react";
import Figures from "./_components/dashboard/Figures";
import Charts from "./_components/dashboard/Charts";

export default function DashboardPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-9">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Dashboard
      </h1>

      <Figures className="mt-4" />
      <Charts />
    </div>
  );
}
