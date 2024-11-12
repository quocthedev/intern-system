import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";
import { AddIcon, DeleteIcon, ExcelIcon, FilterIcon } from "./Icons";
import NewPrositionModal from "./NewPositionModal";
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
        className="flex-1"
      />
      <NewPrositionModal />
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
  );
}
