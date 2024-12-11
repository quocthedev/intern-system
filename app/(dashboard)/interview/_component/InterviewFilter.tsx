"use client";
import React from "react";
import { DatePicker } from "@nextui-org/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { FilterIcon } from "@/app/(dashboard)/internPeriod/_components/Icons";
import { removeEmptyFields } from "@/libs/utils";
import { useInterviewContext } from "@/app/(dashboard)/interview/_providers/InterviewProvider";
import { Chip } from "@nextui-org/chip";
import { getLocalTimeZone, today } from "@internationalized/date";
import { isWeekend, addDays } from "date-fns";

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

  let isDateUnavailable = (date: Date) => {
    // Adjust for Vietnam timezone (UTC+7)
    const vietnamDate = addDays(date, 1);

    // Check if the adjusted date is a weekend
    return isWeekend(vietnamDate);
  };

  return (
    <div className="flex items-center gap-3">
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
            maxValue={today(getLocalTimeZone())}
            defaultValue={today(getLocalTimeZone())}
            isDateUnavailable={isDateUnavailable as any}
          />
          <DatePicker
            label="To date"
            name="toDate"
            showMonthAndYearPickers
            granularity="day"
            minValue={today(getLocalTimeZone())}
            defaultValue={today(getLocalTimeZone())}
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
      <>
        {!(filter as InterViewFilter) ||
          Object.entries(filter as Record<string, unknown>).map(
            ([key, value]) => (
              <Chip
                color="primary"
                variant="bordered"
                onClose={() => removeOneFilter(key as keyof InterViewFilter)}
                key={key}
              >
                {key}:{value as string}
              </Chip>
            ),
          )}
      </>
    </div>
  );
}
