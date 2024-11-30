"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { removeEmptyFields } from "@/libs/utils";
import { Chip } from "@nextui-org/chip";
import { useUniversityCandidateContext } from "../_providers/UniversityCandidateProvider";
import { FilterIcon } from "../../_components/Icons";

const CandidateStatusMapping = {
  0: "Pending",
  1: "Approved",
  2: "Rejected",
  3: "InterviewEmailSent",
  4: "CompletedOJT",
  5: "Out",
};

const CandidateGenderMapping = {
  0: "Male",
  1: "Female",
};

type CandidateFilter = Partial<{
  Status: string;
  Gender: string;
}>;

export default function UniversityCandidateFilter() {
  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useUniversityCandidateContext();

  const applyFilter = (data: FormData) => {
    let filter = Object.fromEntries(data.entries());

    filter = removeEmptyFields<CandidateFilter>(filter);

    if (Object.keys(filter).length === 0) {
      setFilter(null);
    } else {
      setFilter(filter);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <>
        {!(filter as CandidateFilter) ||
          Object.entries(filter as Record<string, unknown>).map(
            ([key, value]) => (
              <Chip
                color="primary"
                variant="bordered"
                onClose={() => removeOneFilter(key as keyof CandidateFilter)}
                key={key}
              >
                {key}:{" "}
                {key === "Status"
                  ? CandidateStatusMapping[Number(value) as 0 | 1 | 2]
                  : key === "Gender"
                    ? CandidateGenderMapping[Number(value) as 0 | 1]
                    : (value as string)}
              </Chip>
            ),
          )}
      </>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button
            color="default"
            size="md"
            variant="shadow"
            className="w-[100px]"
          >
            <FilterIcon />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[250px] gap-3 p-3"
          as={"form"}
          action={applyFilter}
        >
          <Select
            label="Status"
            name="Status"
            //   defaultSelectedKeys={["0"]}
            items={Object.entries(CandidateStatusMapping).map(
              ([key, value]) => ({
                value: key,
                label: value,
              }),
            )}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>

          <Select
            label="Gender"
            name="Gender"
            items={Object.entries(CandidateGenderMapping).map(
              ([key, value]) => ({
                value: key,
                label: value,
              }),
            )}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>

          <Button color="primary" variant="shadow" fullWidth type="submit">
            Apply
          </Button>

          <Button
            color="default"
            variant="shadow"
            fullWidth
            onClick={() => removeAllFilter()}
          >
            Clear
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
