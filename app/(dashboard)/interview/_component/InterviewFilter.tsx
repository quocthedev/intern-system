"use client";
import React from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { FilterIcon } from "@/app/(dashboard)/internPeriod/_components/Icons";
import { Select, SelectItem } from "@nextui-org/select";
import { removeEmptyFields } from "@/libs/utils";
import { useInterviewContext } from "@/app/(dashboard)/interview/_providers/InterviewProvider";
import { Chip } from "@nextui-org/chip";

type InterViewFilter = Partial<{
  FromDate: string;
  ToDate: string;
}>;

export default function InterviewFilter() {
  const {
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
    setInterviewPageId,
  } = useInterviewContext() || {};

  const applyFilter = (data: FormData) => {
    const fromDate = data.get("fromDate");
    const toDate = data.get("toDate");
    const status = data.get("status");

    const newFilter = removeEmptyFields<InterViewFilter>({
      FromDate: fromDate as string,
      ToDate: toDate as string,
    });

    if (Object.keys(newFilter).length === 0) {
      setFilter(null);
    } else {
      setFilter(newFilter);
    }

    setInterviewPageId(1);
  };

  return (
    <div className="flex items-center gap-3">
      <>
        {!(filter as InterViewFilter) ||
          Object.entries(filter as Record<string, unknown>).map(([key]) => (
            <Chip
              color="primary"
              variant="bordered"
              onClose={() => removeOneFilter(key as keyof InterViewFilter)}
              key={key}
            >
              {key}:{" "}
            </Chip>
          ))}
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
          <DatePicker
            label="From date"
            name="fromDate"
            showMonthAndYearPickers
            granularity="day"
          />
          <DatePicker
            label="To date"
            name="toDate"
            showMonthAndYearPickers
            granularity="day"
          />

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
