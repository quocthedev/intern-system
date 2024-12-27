import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";
import { AddIcon } from "./Icons";
import ProjectModal from "./ProjectModal";
import { useDisclosure } from "@nextui-org/modal";
import ProjectListProvider, {
  useProjectListContext,
} from "@/app/(dashboard)/project/_providers/ProjectListProvider";
import ProjectListFilter from "@/app/(dashboard)/project/_components/ProjectListFilter";

export default function ActionBar() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { setProjectListSearch } = useProjectListContext();

  return (
    <ProjectListProvider>
      <div>
        <div className="mb-3 flex w-full gap-3">
          <Input
            size="md"
            placeholder="Search by name, mentor, technology,..."
            className="flex-1"
            onChange={(e) => setProjectListSearch(e.target.value)}
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
          </div>
        </div>
        <ProjectListFilter />
      </div>
    </ProjectListProvider>
  );
}
