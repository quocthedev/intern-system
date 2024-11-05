"use client";
import React from "react";
import ActionBar from "./_components/ActionBar";
import FilterSelector from "./_components/FilterSelector";
import { useToggle } from "usehooks-ts";
import PositionTable from "@/app/(dashboard)/position/_components/PositionTable";

export default function PositionPage() {
  const [showFilter, toggleShowFilter] = useToggle(false);

  return (
    <div className="flex flex-col gap-4">
      <ActionBar toggleShowFilter={toggleShowFilter} />
      {/* <div className="flex w-full gap-6">
        <PositionList isShowFilter={showFilter} />
        {showFilter && <FilterSelector />}
      </div> */}
      <PositionTable />
    </div>
  );
}
