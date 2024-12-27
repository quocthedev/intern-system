"use client";

import { Input } from "@nextui-org/input";
import NewUniverModal from "@/app/(dashboard)/university/_components/NewUniModal";
import { useUniversityContext } from "@/app/(dashboard)/university/_providers/UniversityProvider";

export default function ActionBar() {
  const { setSearch } = useUniversityContext();

  return (
    <div className="mb-3">
      <div className="mb-5 mt-3 flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by name, group, technology,..."
          size="md"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex min-w-max gap-3">
          <NewUniverModal />
        </div>
      </div>
    </div>
  );
}
