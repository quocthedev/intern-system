"use client";
import { Input } from "@nextui-org/input";

import { useUniversityCandidateContext } from "../_providers/UniversityCandidateProvider";
import ImportExcelModal2 from "../ImportExcelModal2";
import { useInternPeriodContext } from "../_providers/InternPeriodDetailProvider";
import UniversityCandidateFilter from "./UniversityCandidateFilter";

export default function ActionBar() {
  const { setSearch, universityId } = useUniversityCandidateContext();

  const { periodId } = useInternPeriodContext();

  return (
    <div className="flex w-full flex-col items-end gap-4">
      <div className="flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by name, group, technology,..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <ImportExcelModal2
          internPeriodId={periodId}
          universityId={universityId}
        />
      </div>
      <UniversityCandidateFilter />
    </div>
  );
}
