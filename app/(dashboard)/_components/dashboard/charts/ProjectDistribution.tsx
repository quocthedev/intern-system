"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  SharedSelection,
} from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import { useQuery } from "@tanstack/react-query";
import APIClient from "@/libs/api-client";
import { BaseResponse, BaseResponseSuccess } from "@/libs/types";
import { API_ENDPOINTS } from "@/libs/config";
import Loading from "@/components/Loading";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

// Sample
// [
//   {
//     "projectId": "056b7ff7-f85e-4266-a449-ec70364fd79b",
//     "title": "Intern System (Don't touch)",
//     "numberOfParticipants": 1,
//     "totalTasks": 0,
//     "taskCountsByStatus": {}
//   },
//   {
//     "projectId": "058f5a56-2e21-4e6d-8aae-38830589c5db",
//     "title": "dự án 3",
//     "numberOfParticipants": 3,
//     "totalTasks": 2,
//     "taskCountsByStatus": {
//       "InProgress": 1,
//       "OverDue": 1
//     }
//   }
// ]

export type ProjectStatistics = {
  projectId: string;
  title: string;
  numberOfParticipants: number;
  totalTasks: number;
  taskCountsByStatus: Record<string, number>;
};

export default function ProjectDistribution() {
  const { data: figures, isLoading } = useQuery({
    queryKey: ["statistic", "project"],
    queryFn: async () => {
      const response = await apiClient.get<BaseResponse<ProjectStatistics[]>>(
        API_ENDPOINTS.statistic + "/project",
      );

      if (response.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<ProjectStatistics[]>;

        return data;
      }

      return null;
    },
  });

  const [selectedProject, setSelectedProject] = React.useState<string>("All");

  if (isLoading) {
    return <Loading />;
  }

  const projectTitles = figures?.map((figure) => figure.title) || [];

  const overviewChartOptions: ApexOptions = {
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
      categories: projectTitles,
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

  const overviewSeries = [
    {
      name: "Total Participants",
      data:
        figures?.map((figure) => Math.trunc(figure.numberOfParticipants)) || [],
    },
    {
      name: "Total Tasks",
      data: figures?.map((figure) => Math.trunc(figure.totalTasks)) || [],
    },
  ];

  const projectSelectionOptions = figures?.map((figure) => ({
    label: figure.title,
    value: figure.projectId,
  }));

  const selectedProjectStatistics = figures?.find(
    (figure) => figure.projectId === selectedProject,
  );

  const taskProgressChartOptions: ApexOptions = {
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
              return String(selectedProjectStatistics?.totalTasks || 0);
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

  const taskProgressSeries = selectedProjectStatistics
    ? [
        selectedProjectStatistics.taskCountsByStatus["NotStarted"] || 0,
        selectedProjectStatistics.taskCountsByStatus["Done"] || 0,
        selectedProjectStatistics.taskCountsByStatus["InProgress"] || 0,
        selectedProjectStatistics.taskCountsByStatus["OverDue"] || 0,
      ]
    : [0, 0, 0, 0];

  return (
    <>
      <Card>
        <CardBody>
          <p className="text-xl font-semibold">Project Distribution Overview</p>
          {typeof window !== "undefined" && (
            <Chart
              options={overviewChartOptions}
              series={overviewSeries}
              type="bar"
              height={350}
            />
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p className="text-xl font-semibold">Task Progress Overview</p>
          <Select
            defaultSelectedKeys={[
              projectSelectionOptions?.[0]?.value as string,
            ]}
            className="w-[150px]"
            label="Select Project"
            variant="underlined"
            items={projectSelectionOptions}
            onSelectionChange={(keys: SharedSelection) => {
              setSelectedProject(keys.currentKey as string);
            }}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
          {typeof window !== "undefined" && (
            <Chart
              options={taskProgressChartOptions}
              series={taskProgressSeries}
              type="radialBar"
              height={390}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}
