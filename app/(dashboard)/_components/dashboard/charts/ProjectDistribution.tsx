"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ProjectDistribution() {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
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
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: ["FPT", "UIT", "HCMUS", "TDT", "HCMUT"],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["#48E970", "#58A9FB", "#D9D9D9"],
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      markers: {
        shape: "circle",
      },
    },
  };

  const [state, setState] = React.useState({
    series: [
      {
        name: "In Progress",
        data: [44, 55, 41, 37, 22],
      },
      {
        name: "Completed OJT",
        data: [53, 32, 33, 52, 13],
      },
      {
        name: "Others",
        data: [12, 17, 11, 9, 15],
      },
    ],
  });

  return (
    <Card>
      <CardBody>
        <p className="text-xl font-semibold">Project Distribution Overview</p>
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
