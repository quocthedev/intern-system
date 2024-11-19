"use client";
import { Button } from "@nextui-org/button";

import { FilterIcon } from "@/app/(dashboard)/intern/_components/Icons";

import { Input } from "@nextui-org/input";

import ImportExcelModal from "@/app/(dashboard)/intern/_components/ImportExcelModal";
import InterviewScheduleModal from "@/components/InterviewScheduleModal";

type ActionBarProps = {
  selectedInterns: Set<{
    id: string;
    fullName: string;
  }>;
};

export default function ActionBar({ selectedInterns }: ActionBarProps) {
  return (
    <div className="mb-5 mt-3 flex w-full items-center gap-2">
      <Input
        type="name"
        placeholder="Search by name, group, technology,..."
        size="md"
      />

      <div className="flex flex-1 gap-2">
        <ImportExcelModal />

        <InterviewScheduleModal candidates={Array.from(selectedInterns)} />

        <Button color="default" size="md" variant="shadow">
          <FilterIcon />
          Filter
        </Button>
      </div>
    </div>
  );
}
