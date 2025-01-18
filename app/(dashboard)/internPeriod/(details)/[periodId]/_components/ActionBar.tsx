"use client";
import { Input } from "@nextui-org/input";

import { useUniversityCandidateContext } from "../_providers/UniversityCandidateProvider";
import ImportExcelModal3 from "../ImportExcelModal3";
import { useInternPeriodContext } from "../_providers/InternPeriodDetailProvider";
import UniversityCandidateFilter from "./UniversityCandidateFilter";
import InterviewScheduleModal from "@/components/InterviewScheduleModal";
import { getCookie } from "@/app/util";

export default function ActionBar() {
  const { setSearch, universityId } = useUniversityCandidateContext();

  const { periodId, internPeriodData } = useInternPeriodContext();

  const role = getCookie("userRole");

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by student code, full name"
          onChange={(e) => setSearch(e.target.value)}
        />
        {role === "HR Manager" ||
        (role === "Administrator" &&
          internPeriodData?.status === "NotStarted") ||
        internPeriodData?.status === "InProgress" ? (
          <div className="flex gap-1">
            <ImportExcelModal3
              internPeriodId={periodId}
              universityId={universityId}
            />

            <InterviewScheduleModal
              isAddingCandidate
              universityId={universityId}
              internPeriodId={periodId}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <UniversityCandidateFilter />
    </div>
  );
}
