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

  const priorityOptions = [
    {
      key: "0",
      value: "Highest",
    },
    {
      key: "1",
      value: "High",
    },
    {
      key: "2",
      value: "Medium",
    },
    {
      key: "3",
      value: "Low",
    },
    {
      key: "4",
      value: "Lowest",
    },
  ];

  const difficultyOptions = [
    {
      key: "1",
      value: "Easy",
    },
    {
      key: "2",
      value: "MediumEasy",
    },
    {
      key: "3",
      value: "Medium",
    },
    {
      key: "4",
      value: "MediumHard",
    },
    {
      key: "5",
      value: "Hard",
    },
  ];

  // const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex gap-3">
      <Autocomplete
        placeholder="Filter by position"
        defaultItems={positionOptions}
        variant="bordered"
        className="w-[250px]"
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
        className="w-[250px]"
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

      <Autocomplete
        placeholder="Filter by priority"
        defaultItems={priorityOptions}
        variant="bordered"
        className="w-[250px]"
        onSelectionChange={(selectedKey) => {
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              Priority: selectedKey ?? "",
            }),
          );
        }}
      >
        {(item) => (
          <SelectItem key={item.key} value={item.key}>
            {item.value}
          </SelectItem>
        )}
      </Autocomplete>

      <Autocomplete
        placeholder="Filter by difficulty"
        defaultItems={difficultyOptions}
        variant="bordered"
        className="w-[250px]"
        onSelectionChange={(selectedKey) => {
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              Difficulty: selectedKey ?? "",
            }),
          );
        }}
      >
        {(item) => (
          <SelectItem key={item.key} value={item.key}>
            {item.value}
          </SelectItem>
        )}
      </Autocomplete>
    </div>
  );
}
