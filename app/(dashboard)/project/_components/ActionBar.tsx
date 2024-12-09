import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";
import { AddIcon, DeleteIcon, ExcelIcon, FilterIcon } from "./Icons";
import ProjectModal from "./ProjectModal";
import { useDisclosure } from "@nextui-org/modal";
export type ActionBarProps = {
  className?: string;
  toggleShowFilter: () => void;
};
export default function ActionBar(props: ActionBarProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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
          color="primary"
          size="md"
          startContent={<AddIcon />}
          className="text-white"
          variant="shadow"
          onPress={onOpen}
        >
          New Project
        </Button>
        <ProjectModal
          mode="create"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
        />
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
