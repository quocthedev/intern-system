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
    <div className="mb-5 mt-3 flex w-full items-center gap-2">
      <Input type="name" placeholder="Search by name, group, technology,..." />
      <div className="flex min-w-max gap-3">
        <NewPeriodModal />
        <Button color="default" size="md" variant="shadow">
          <FilterIcon />
          Filter
        </Button>{" "}
      </div>
    </div>
  );
}
