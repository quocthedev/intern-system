import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";
import { AddIcon, DeleteIcon, ExcelIcon, FilterIcon } from "./Icons";
import NewProjectModal from "./NewProjectModal";
import { useDisclosure } from "@nextui-org/modal";
export type ActionBarProps = {
  className?: string;
  toggleShowFilter: () => void;
};
export default function ActionBar(props: ActionBarProps) {
  return (
    <div className="flex w-full gap-3">
      <Input
        size="md"
        placeholder="Search by name, mentor, technology,..."
        // className="w-[700px]"
        className="flex-1"
      />
      <div className="flex min-w-max gap-3">
        <Button
          color="success"
          size="md"
          startContent={<ExcelIcon />}
          className="text-white"
          variant="shadow"
        >
          Export to Excel
        </Button>

        <Button
          color="danger"
          size="md"
          startContent={<DeleteIcon />}
          className="text-white"
          variant="shadow"
        >
          Delete
        </Button>
        <NewProjectModal />
        <Button
          color="default"
          size="md"
          startContent={<FilterIcon />}
          variant="shadow"
          className=""
          onClick={() => props.toggleShowFilter()}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}
