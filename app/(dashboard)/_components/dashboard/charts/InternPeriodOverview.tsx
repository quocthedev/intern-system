"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function InternPeriodOverview() {
  const options: ApexOptions = {
    chart: {
      id: "basic-bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
        borderRadius: 10,
      },
    },
    xaxis: {
      categories: ["Spring 2021", "Summer 2021", "Fall 2021", "Winter 2021"],
    },
  };

  const [state, setState] = React.useState({
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50],
      },
    ],
  });

  return (
    <Card>
      <CardBody>
        <p className="text-xl font-semibold">Intern Period Overview</p>
        {typeof window !== "undefined" && (
          <Chart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        )}
      </CardBody>
    </Card>
  );
}
