import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";

import { InterviewIcon, ExcelIcon } from "@/components/icons/ActionBarIcons";
import ImportExcelModal from "@/app/(dashboard)/intern/_components/ImportExcelModal";

type ActionBarProps = {
  selectedInterns: Set<string>;
};

export default function ActionBar() {
  return (
    <div className="flex w-full gap-3">
      <Input
        size="md"
        placeholder="Search students, projects, interviews,..."
        // className="w-[700px]"
        className="flex-1"
      />
      <div className="flex min-w-max gap-3">
        <ImportExcelModal />

        <Button
          color="primary"
          size="md"
          startContent={<InterviewIcon />}
          className="text-white"
          variant="shadow"
        >
          Schedule Interview
        </Button>

        <Button
          color="success"
          size="md"
          startContent={<ExcelIcon />}
          className="text-white"
          variant="shadow"
        >
          Export to Excel
        </Button>
      </div>
    </div>
  );
}
