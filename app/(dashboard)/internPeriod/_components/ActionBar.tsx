"use client";
import { Input } from "@nextui-org/input";
import NewPeriodModalNext from "./NewPeriodModal_next";
import { useInternPeriodContext } from "../_providers/InternPeriodProvider";
import InternPeriodFilter from "./InternPeriodFilter";

export default function ActionBar() {
  const { setSearch } = useInternPeriodContext();

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center gap-2">
        <Input
          type="name"
          placeholder="Search by intern period name"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex min-w-max gap-3">
          {/* <NewPeriodModal /> */}
          <NewPeriodModalNext />
        </div>
      </div>
      <InternPeriodFilter />
    </div>
  );
}
