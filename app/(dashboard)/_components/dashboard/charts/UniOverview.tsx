"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody } from "@nextui-org/react";
import { ApexOptions } from "apexcharts";
import APIClient from "@/libs/api-client";
import { useQuery } from "@tanstack/react-query";
import { BaseResponse, BaseResponseSuccess } from "@/libs/types";
import { API_ENDPOINTS } from "@/libs/config";
import Loading from "@/components/Loading";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type UniStatistics = {
  universities: {
    name: string;
    abbreviation: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };
  approvedCount: number;
  interviewEmailSentCount: number;
  passInterviewRate: number;
  inProgressCount: number;
  completeOjtCount: number;
  passOjtRate: number;
};

const StatusMetricsMapping: Record<string, string> = {
  approvedCount: "Approved",
  interviewEmailSentCount: "Interview Email Sent",
  inProgressCount: "In Progress",
  completeOjtCount: "Complete OJT",
};

const RateMetricsMapping: Record<string, string> = {
  passInterviewRate: "Pass Interview Rate",
  passOjtRate: "Pass OJT Rate",
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

export default function UniOverview() {
  const { data: figures, isLoading } = useQuery({
    queryKey: ["statistic", "university"],
    queryFn: async () => {
      const response = await apiClient.get<BaseResponse<UniStatistics[]>>(
        API_ENDPOINTS.statistic + "/university",
      );

      if (response.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<UniStatistics[]>;

        return data;
      }

      return null;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const universities =
    figures?.map((figure) => figure.universities.abbreviation) || [];

  const studentCountSeries = Object.entries(StatusMetricsMapping).map(
    ([key, value]) => {
      return {
        name: value,
        data:
          figures?.map((figure) => figure[key as keyof UniStatistics]) || [],
      };
    },
  ) as Array<{ name: string; data: number[] }>;

  const rateSeries = Object.entries(RateMetricsMapping).map(([key, value]) => {
    return {
      name: value,
      data:
        figures?.map((figure) =>
          parseFloat(Number(figure[key as keyof UniStatistics]).toFixed(2)),
        ) || [],
    };
  }) as Array<{ name: string; data: number[] }>;

  const studentsCountChartOption: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
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
      categories: universities,
      title: {
        text: "Universities",
      },
    },
    yaxis: {
      title: {
        text: "Number of Students",
      },
    },

    fill: {
      opacity: 1,
      colors: ["#48E970", "#58A9FB", "#D9D9D9", "#F31260"],
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      markers: {
        shape: "circle",
      },
    },
  };

  const rateChartOptions: ApexOptions = {
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
            offsetY: 30,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
          position: "top",
        },
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
      offsetY: -10,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    stroke: {
      width: 0,
    },
    xaxis: {
      categories: universities,
      title: {
        text: "Universities",
      },
    },
    yaxis: {
      title: {
        text: "Rate (%)",
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

  return (
    <>
      <Card>
        <CardBody>
          <p className="text-xl font-semibold">Universities Overview</p>
          {typeof window !== "undefined" && (
            <Chart
              options={studentsCountChartOption}
              series={studentCountSeries}
              type="bar"
              height={350}
            />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <p className="text-xl font-semibold">
            Universities Pass Rate Overview
          </p>
          {typeof window !== "undefined" && (
            <Chart
              options={rateChartOptions}
              series={rateSeries}
              type="bar"
              height={350}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}
