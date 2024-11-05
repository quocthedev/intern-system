"use client";
import { Card, CardBody } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import React from "react";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";
export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
];
const filters = [
  { key: "leader", label: "Leader", placeholder: "Select name of leader" },
  {
    key: "subleader",
    label: "Subleader",
    placeholder: "Select name of subleader",
  },
  { key: "mentor", label: "Mentor", placeholder: "Select name of mentor" },
  {
    key: "technology",
    label: "Technology",
    placeholder: "Select name of technology",
  },
  { key: "status", label: "Status", placeholder: "Select name of status" },
];

export default function FilterSelector() {
  return (
    <Card className="h-full w-[400px] p-3">
      <CardBody>
        <div className="flex flex-col gap-3">
          {filters.map((filter) => (
            <div className="flex flex-col gap-2" key={filter.key}>
              <p className="text-sm font-semibold">{filter.label}</p>
              <Select
                aria-labelledby={filter.label}
                className="max-w-xs"
                variant="underlined"
                labelPlacement="outside"
                placeholder={filter.placeholder}
                classNames={{
                  label: "font-semibold text-xs",
                  innerWrapper: "text-xs",
                  base: "text-xs",
                }}
                size="sm"
              >
                {animals.map((animal) => (
                  <SelectItem key={animal.key}>{animal.label}</SelectItem>
                ))}
              </Select>
            </div>
          ))}
          <Button color="primary" className="mt-2">
            Search
          </Button>
          <Button variant="bordered">Clear Filter</Button>
        </div>
      </CardBody>
    </Card>
  );
}
