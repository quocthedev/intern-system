"use client";
import { Button } from "@nextui-org/button";

import { FilterIcon } from "@/app/(dashboard)/intern/_components/Icons";

import { Input } from "@nextui-org/input";
import { CreateIcon } from "@/app/(dashboard)/technology/_components/Icons";
import NewTechModal from "@/app/(dashboard)/technology/_components/NewTechModal";

export default function ActionBar() {
  return (
    <div className="mb-3">
      <div className="mb-5 mt-3 flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by name, group, technology,..."
          size="md"
        />
        <div className="flex min-w-max gap-3">
          <NewTechModal />
        </div>
      </div>
    </div>
  );
}
