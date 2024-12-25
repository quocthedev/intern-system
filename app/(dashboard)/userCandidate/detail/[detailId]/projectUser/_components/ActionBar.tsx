import { Input } from "@nextui-org/input";
import React from "react";
import { useDisclosure } from "@nextui-org/modal";
import ProjectListFilter from "@/app/(dashboard)/userCandidate/detail/[detailId]/projectUser/_components/ProjectListFilter";
import ProjectListProvider, {
  useProjectListContext,
} from "@/app/(dashboard)/userCandidate/detail/[detailId]/projectUser/_providers/ProjectListProvider";

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
        </div>
        <ProjectListFilter />
      </div>
    </ProjectListProvider>
  );
}
