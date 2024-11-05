import { TechCard } from "@/app/(dashboard)/question/_components/TechCard";
import React from "react";

export default function TechnologyPage() {
  return (
    <div className="p-9">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Question Bank Management
      </h1>
      <TechCard />
    </div>
  );
}
