"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PassFailUni() {
  const internPeriods = [
    { key: "All", label: "All Intern Period" },
    {
      key: "InternPeriod1",
      label: "Intern Period 1",
    },
  ];
  const options: ApexOptions = {
    chart: {
      type: "donut",
      id: "PassFailUni",
    },

    labels: ["Interviewing", "Interview Passed", "Interview Failed"],
    fill: {
      opacity: 1,
      colors: ["#58A9FB", "#48E970", "#F31260"],
    },
  };

  const series = [44, 55, 41];

  return (
    <Card>
      <CardBody>
        <p className="text-xl font-semibold">
          Pass/Fail University Distribution
        </p>
        <Select
          defaultSelectedKeys={["All"]}
          className="w-[150px]"
          label="Select intern period"
          variant="underlined"
        >
          {internPeriods.map((internPeriod) => (
            <SelectItem key={internPeriod.key}>{internPeriod.label}</SelectItem>
          ))}
        </Select>
        {typeof window !== "undefined" && (
          <Chart options={options} series={series} height={350} type="donut" />
        )}
      </CardBody>
    </Card>
  );
}
