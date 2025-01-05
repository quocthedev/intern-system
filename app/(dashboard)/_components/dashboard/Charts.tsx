"use client";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { CalendarIcon, UniversityIcon } from "./Icons";
import UniOverview from "./charts/UniOverview";
import PassFailUni from "./charts/PassFailUni";
import InternPeriodOverview from "./charts/InternPeriodOverview";
import InterviewMetrics from "./charts/InterviewMetrics";
import ProjectDistribution from "./charts/ProjectDistribution";

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
const BarChart: React.FC = () => {
  const options: any = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];

  return (
    <div className="mt-4">
      {typeof window !== "undefined" && (
        <Chart options={options} series={series} type="bar" height={350} />
      )}
    </div>
  );
};

const PieChart: React.FC = () => {
  const options: any = {
    chart: {
      type: "donut",
    },
    labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
  };

  const series = [44, 55, 13, 43, 22];

  return (
    <div className="mt-4">
      {typeof window !== "undefined" && (
        <Chart options={options} series={series} type="pie" height={350} />
      )}
    </div>
  );
};

export default function Charts() {
  return (
    <div className="mt-4 flex w-full flex-col">
      <div className="grid grid-cols-2 gap-6">
        <UniOverview />
        <PassFailUni />
        <InternPeriodOverview />
        <InterviewMetrics />
        <ProjectDistribution />
      </div>
    </div>
  );
}
