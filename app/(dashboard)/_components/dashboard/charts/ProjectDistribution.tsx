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
        borderRadius: 5,
      },
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: [
        "Project 1",
        "Project 2",
        "Project 3",
        "Project 4",
        "Project 5",
      ],
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
      colors: ["#48E970", "#58A9FB"],
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
        name: "Total Members",
        data: [44, 55, 41, 37, 22],
      },
      {
        name: "Total Tasks",
        data: [53, 32, 33, 52, 13],
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
