"use client";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useState } from "react";
import { useProjectDetailContext } from "../../_providers/ProjectDetailProvider";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";

export default function TaskFilter() {
  const {
    projectSummary,
    relatedUser,
    setProjectTaskFilter,
    projectTaskFilter,
  } = useProjectDetailContext();

  const positionOptions = [
    ...(projectSummary?.listPosition.map((position) => ({
      value: position.id,
      label: position.name,
    })) || []),
  ];

  const userOptions = [
    ...(relatedUser?.map((user) => ({
      value: user.id,
      label: user.name,
    })) || []),
  ];

  // const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex gap-3">
      <Autocomplete
        placeholder="Filter by position"
        defaultItems={positionOptions}
        variant="bordered"
        className="w-[300px]"
        onSelectionChange={(selectedKey) => {
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              PositionId: selectedKey ?? "",
            }),
          );
        }}
      >
        {(item) => (
          <AutocompleteItem key={item.value} value={item.value}>
            {item.label}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        placeholder="Filter by members"
        defaultItems={userOptions}
        variant="bordered"
        className="w-[300px]"
        onSelectionChange={(selectedKey) => {
          console.log(selectedKey);

          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              UserId: selectedKey ?? "",
            }),
          );
        }}
      >
        {(item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        )}
      </Autocomplete>
    </div>
  );
}
