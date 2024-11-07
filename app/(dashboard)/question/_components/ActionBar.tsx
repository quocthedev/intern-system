"use client";
import { Button } from "@nextui-org/button";

import {
  FilterIcon,
  ExcelIcon,
} from "@/app/(dashboard)/intern/_components/Icons";

import { Input } from "@nextui-org/input";
import NewUniverModal from "@/app/(dashboard)/university/_components/NewUniModal";

// export type ActionBarProps = {
//   selectedInterns: any[];
// };

export default function ActionBar() {
  return (
    <div className="mb-5 mt-3 flex w-full items-center">
      <div className="flex min-w-max gap-3">
        <NewUniverModal />
        <Button color="default" size="sm" variant="shadow">
          <FilterIcon />
          Filter
        </Button>
      </div>
    </div>
  );
}
