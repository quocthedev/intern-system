"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody, Select, SelectItem } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AssignedProjectRate() {
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

    labels: ["Assigned", "Not Assigned"],
    fill: {
      opacity: 1,
      colors: ["#58A9FB", "#48E970"],
    },
  };

  const series = [44, 55];

  return (
    <Card>
      <CardBody>
        <p className="text-xl font-semibold">Assigned Project Rate</p>
        {/* <Select
          defaultSelectedKeys={["All"]}
          className="w-[150px]"
          label="Select intern period"
          variant="underlined"
        >
          {internPeriods.map((internPeriod) => (
            <SelectItem key={internPeriod.key}>{internPeriod.label}</SelectItem>
          ))}
        </Select> */}
        {typeof window !== "undefined" && (
          <Chart options={options} series={series} height={350} type="donut" />
        )}
      </CardBody>
    </Card>
  );
}
