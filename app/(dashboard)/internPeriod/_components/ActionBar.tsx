"use client";
import { Button } from "@nextui-org/button";

import {
  FilterIcon,
  ExcelIcon,
} from "@/app/(dashboard)/intern/_components/Icons";

import { Input } from "@nextui-org/input";
import NewPeriodModal from "@/app/(dashboard)/internPeriod/_components/NewPeriodModal";

// export type ActionBarProps = {
//   selectedInterns: any[];
// };

export default function ActionBar() {
  return (
    <div className="flex items-center gap-2 p-4">
      <Input
        type="name"
        placeholder="Search by name, group, technology,..."
        className="h-10 w-[45%]"
      />
      <Button color="success" size="sm" variant="shadow" className="text-white">
        <ExcelIcon /> Import excel file
      </Button>

      <NewPeriodModal />
      <Button color="default" size="sm" variant="shadow">
        <FilterIcon />
        Filter
      </Button>
    </div>
  );
}
