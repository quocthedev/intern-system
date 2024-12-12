"use client";
import { FilterIcon } from "@/components/icons/ActionBarIcons";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React from "react";
import { useAccountContext } from "../_providers/AccountProvider";

export default function ActionBar() {
  const { setAccountSearch } = useAccountContext();

  return (
    <div>
      <Input
        size="md"
        placeholder="Search by name, mentor, technology,..."
        className="flex-1"
        fullWidth
        onChange={(e) => setAccountSearch(e.target.value)}
      />

      <Button
        color="default"
        size="md"
        startContent={<FilterIcon />}
        variant="shadow"
        className="mt-3"
        // onClick={() => props.toggleShowFilter()}
      >
        Filter
      </Button>
    </div>
  );
}
