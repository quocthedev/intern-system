"use client";
import { Select, SelectItem } from "@nextui-org/select";
import React, { useState } from "react";
import { useProjectDetailContext } from "../../_providers/ProjectDetailProvider";

export default function TaskFilter() {
  const {
    projectSummary,
    relatedUser,
    setProjectTaskFilter,
    projectTaskFilter,
  } = useProjectDetailContext();

  const positionOptions = [
    {
      value: "",
      label: "All positions",
    },
    ...(projectSummary?.listPosition.map((position) => ({
      value: position.id,
      label: position.name,
    })) || []),
  ];

  const userOptions = [
    {
      value: "",
      label: "All members",
    },
    ...(relatedUser?.map((user) => ({
      value: user.id,
      label: user.name,
    })) || []),
  ];

  return (
    <div className="flex gap-3">
      <Select
        placeholder="Filter by position"
        items={positionOptions}
        variant="bordered"
        className="w-[200px]"
        defaultSelectedKeys={[""]}
        onSelectionChange={(selectedKeys) => {
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              PositionId: selectedKeys.currentKey as string,
            }),
          );
        }}
      >
        {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
      </Select>

      <Select
        placeholder="Filter by members"
        items={userOptions}
        variant="bordered"
        className="w-[200px]"
        defaultSelectedKeys={[""]}
        onSelectionChange={(selectedKeys) => {
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              UserId: selectedKeys.currentKey as string,
            }),
          );
        }}
      >
        {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
      </Select>
    </div>
  );
}
