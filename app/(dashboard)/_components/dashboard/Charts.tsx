import React from "react";
import UniOverview from "./charts/UniOverview";
import InternPeriodOverview from "./charts/InternPeriodOverview";
import ProjectDistribution from "./charts/ProjectDistribution";
import TaskProgress from "./charts/TaskProgress";
import AssignedProjectRate from "./charts/AssignedProjectRate";

export default function Charts() {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="grid grid-cols-2 gap-6">
        <UniOverview />
        <InternPeriodOverview />
        <ProjectDistribution />

        <AssignedProjectRate />
      </div>
    </div>
  );
}
