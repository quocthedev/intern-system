"use client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { CalendarIcon, UniversityIcon } from "./Icons";

export const intervals = [
  { key: "1_month", label: "1 Month" },
  { key: "3_month", label: "3 Months" },
  { key: "6_month", label: "6 Months" },
  { key: "1_year", label: "1 Year" },
];

const universities = [
  { key: "FPT University", label: "FPT University" },
  { key: "Hanoi University", label: "Hanoi University" },
  { key: "Hanoi University of Science and Technology", label: "HUST" },
  { key: "Hanoi University of Business and Technology", label: "HUBT" },
];
const AreaChart: React.FC = () => {
  const options: any = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const series = [
    {
      name: "Total Students Received CV",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Total Students Interviewed",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
    {
      name: "Total Students Passed",
      data: [21, 42, 55, 32, 44, 62, 51],
    },
    {
      name: "Total Students Interning",
      data: [31, 52, 65, 32, 54, 72, 61],
    },
  ];

  return (
    <div className="mt-4">
      {typeof window !== "undefined" && (
        <Chart options={options} series={series} type="area" height={350} />
      )}
    </div>
  );
};

export default function Charts() {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="flex w-full justify-between">
        <Select
          defaultSelectedKeys={["FPT University"]}
          className="w-[350px]"
          startContent={<UniversityIcon />}
          variant="underlined"
          size="lg"
        >
          {universities.map((uni) => (
            <SelectItem key={uni.key}>{uni.label}</SelectItem>
          ))}
        </Select>
        <Select
          defaultSelectedKeys={["1_month"]}
          className="w-[150px]"
          startContent={<CalendarIcon />}
        >
          {intervals.map((interval) => (
            <SelectItem key={interval.key}>{interval.label}</SelectItem>
          ))}
        </Select>
      </div>

      <AreaChart />
    </div>
  );
}
