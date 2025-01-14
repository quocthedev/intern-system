"use client";

import { Input } from "@nextui-org/input";
import NewTechModal from "@/app/(dashboard)/technology/_components/NewTechModal";
import { useTechnologyContext } from "@/app/(dashboard)/technology/_providers/TechnologyProvider";

export default function ActionBar() {
  const { setSearch } = useTechnologyContext();

  return (
    <div className="mb-3">
      <div className="mb-5 mt-3 flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by technology name"
          size="md"
          onChange={(e) => setSearch(e.target.value)}
        />
        <NewTechModal />
      </div>
    </div>
  );
}
