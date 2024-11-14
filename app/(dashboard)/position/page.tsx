"use client";
import React from "react";
import ActionBar from "./_components/ActionBar";
import PositionTable from "@/app/(dashboard)/position/_components/PositionTable";

export default function PositionPage() {
  return (
    <div className="flex flex-col gap-4">
      <ActionBar />
      <PositionTable />
    </div>
  );
}
