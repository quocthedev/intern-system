"use client";
import { Input } from "@nextui-org/input";

import { useUniversityCandidateContext } from "../_providers/UniversityCandidateProvider";
import ImportExcelModal3 from "../ImportExcelModal3";
import { useInternPeriodContext } from "../_providers/InternPeriodDetailProvider";
import UniversityCandidateFilter from "./UniversityCandidateFilter";
import InterviewScheduleModal from "@/components/InterviewScheduleModal";

export default function ActionBar() {
  const { setSearch, universityId } = useUniversityCandidateContext();

  const { periodId } = useInternPeriodContext();

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by student code, full name"
          onChange={(e) => setSearch(e.target.value)}
        />

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
      <UniversityCandidateFilter />
    </div>
  );
}
