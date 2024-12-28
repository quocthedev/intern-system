import { FilterIcon } from "@/app/(dashboard)/project/_components/Icons";
import { removeEmptyFields } from "@/libs/utils";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { DatePicker } from "@nextui-org/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";

import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useProjectListContext } from "@/app/(dashboard)/candidate/detail/[detailId]/projectUser/_providers/ProjectListProvider";

const ProjectListStatusMapping = {
  0: "NotStarted",
  1: "Open",
  2: "Closed",
};

type ProjectListFilter = Partial<{
  Status: string;
  FromDate: string;
  ToDate: string;
}>;

export default function ProjectListFilter() {
  const {
    projectListFilter,
    setProjectListFilter,
    removeOneProjectListFilter,
    removeAllProjectListFilter,
    setProjectListPageIndex,
  } = useProjectListContext() || {};

  const applyFilter = (data: FormData) => {
    const status = data.get("status");
    const fromDate = data.get("fromDate");
    const toDate = data.get("toDate");

    const newFilter = removeEmptyFields<ProjectListFilter>({
      Status: status as string,
      FromDate: fromDate as string,
      ToDate: toDate as string,
    });

    if (Object.keys(newFilter).length === 0) {
      setProjectListFilter(null);
    } else {
      setProjectListFilter(newFilter);
    }

    setProjectListPageIndex(1);
  };

  return (
    <div className="mb-4 flex items-center gap-3">
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
          onSubmit={(e) => {
            e.preventDefault();
            applyFilter(new FormData(e.target as HTMLFormElement));
          }}
        >
          <Select
            label="Status"
            name="status"
            defaultSelectedKeys="1"
            items={Object.entries(ProjectListStatusMapping).map(
              ([key, value]) => ({
                value: key,
                label: value,
              }),
            )}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>

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
            minValue={today(getLocalTimeZone())}
          />

          <Button color="primary" variant="shadow" fullWidth type="submit">
            Apply
          </Button>

          <Button
            color="default"
            variant="shadow"
            fullWidth
            onClick={() => removeAllProjectListFilter()}
          >
            Clear
          </Button>
        </PopoverContent>
      </Popover>
      <>
        {!(projectListFilter as ProjectListFilter) ||
          Object.entries(projectListFilter as Record<string, unknown>).map(
            ([key, value]) => (
              <Chip
                color="primary"
                variant="bordered"
                onClose={() => removeOneProjectListFilter(key as never)}
                key={key}
              >
                {key}:{}
                {key === "Status"
                  ? ProjectListStatusMapping[Number(value) as 0 | 1 | 2]
                  : (value as string)}
              </Chip>
            ),
          )}
      </>
    </div>
  );
}
