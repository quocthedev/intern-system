"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TaskProgress() {
  const options: ApexOptions = {
    chart: {
      height: 390,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
          image: undefined,
        },

        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total Tasks",
            formatter: function (w) {
              // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
              return "249";
            },
          },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "16px",
          formatter: function (seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
          },
        },
      },
    },
    colors: ["#48E970", "#58A9FB", "#FF9500", "#F31260"],
    labels: ["Not Started", "Done", "In Progress", "Overdue"],
  };

  const series = [76, 67, 61, 90];

  return (
    <Card>
      <CardBody>
        <p className="text-xl font-semibold">Task Progress Overview</p>
        {typeof window !== "undefined" && (
          <Chart
            options={options}
            series={series}
            type="radialBar"
            height={390}
          />
        )}
      </CardBody>
    </Card>
  );
}
