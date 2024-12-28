import { Input } from "@nextui-org/input";
import React from "react";
import { useDisclosure } from "@nextui-org/modal";
import ProjectListProvider, {
  useProjectListContext,
} from "@/app/(dashboard)/candidate/detail/[detailId]/projectUser/_providers/ProjectListProvider";
import ProjectListFilter from "@/app/(dashboard)/candidate/detail/[detailId]/projectUser/_components/ProjectListFilter";

export default function ActionBar() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { setProjectListSearch } = useProjectListContext();

  return (
    <ProjectListProvider>
      <div>
        <div className="mb-3 flex w-full gap-3">
          <Input
            size="md"
            placeholder="Search by name"
            className="flex-1"
            onChange={(e) => setProjectListSearch(e.target.value)}
          />
        </div>
        <ProjectListFilter />
      </div>
    </ProjectListProvider>
  );
}
