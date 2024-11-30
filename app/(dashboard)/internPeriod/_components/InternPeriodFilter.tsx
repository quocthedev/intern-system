"use client";
import React from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { FilterIcon } from "./Icons";
import { InternPeriodStatus } from "../_types/intern-period";
import { Select, SelectItem } from "@nextui-org/select";
import { removeEmptyFields } from "@/libs/utils";
import { Chip } from "@nextui-org/chip";
import { useInternPeriodContext } from "../_providers/InternPeriodProvider";

const InternPeriodStatusMapping = {
  0: InternPeriodStatus.NotYet,
  1: InternPeriodStatus.InProgress,
  2: InternPeriodStatus.Ended,
};

type InternPeriodFilter = Partial<{
  FromDate: string;
  ToDate: string;
  Status: string;
}>;

export default function InternPeriodFilter() {
  const { filter, setFilter, removeOneFilter, removeAllFilter } =
    useInternPeriodContext() || {};

  const applyFilter = (data: FormData) => {
    const fromDate = data.get("fromDate");
    const toDate = data.get("toDate");
    const status = data.get("status");

    const newFilter = removeEmptyFields<InternPeriodFilter>({
      FromDate: fromDate as string,
      ToDate: toDate as string,
      Status: status as string,
    });

    if (Object.keys(newFilter).length === 0) {
      setFilter(null);
    } else {
      setFilter(newFilter);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <>
        {!(filter as InternPeriodFilter) ||
          Object.entries(filter as Record<string, unknown>).map(
            ([key, value]) => (
              <Chip
                color="primary"
                variant="bordered"
                onClose={() => removeOneFilter(key as keyof InternPeriodFilter)}
                key={key}
              >
                {key}:{" "}
                {key === "Status"
                  ? InternPeriodStatusMapping[Number(value) as 0 | 1 | 2]
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

          <Select
            label="Status"
            name="status"
            //   defaultSelectedKeys={["0"]}
            items={Object.entries(InternPeriodStatusMapping).map(
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
