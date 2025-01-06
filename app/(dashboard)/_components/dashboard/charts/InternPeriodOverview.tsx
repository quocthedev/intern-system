"use client";

import React, { useState } from "react";
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
import { BaseResponse, BaseResponseSuccess } from "@/libs/types";
import { API_ENDPOINTS } from "@/libs/config";
import APIClient from "@/libs/api-client";
import Loading from "@/components/Loading";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export type InternPeriodStatistics = {
  internPeriod: {
    name: string;
    startDate: string;
    endDate: string;
    internshipDuration: number;
    maxCandidateQuantity: number;
    currentUniversityQuantity: number;
    currentCandidateQuantity: number;
    status: string;
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  };
  totalCandidates: number;
  passRate: number;
  failRate: number;
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

export default function InternPeriodOverview() {
  const { data: internPeriodStatistics, isLoading } = useQuery({
    queryKey: ["statistic", "intern-period"],
    queryFn: async () => {
      const response = await apiClient.get<
        BaseResponse<InternPeriodStatistics[]>
      >(API_ENDPOINTS.statistic + "/intern-period");

      if (response.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<
          InternPeriodStatistics[]
        >;

        return data;
      }

      return null;
    },
  });

  const [selectedInternPeriod, setSelectedInternPeriod] = useState<string>();

  if (isLoading) {
    return <Loading />;
  }

  const internPeriods = internPeriodStatistics?.map(
    (internPeriod) => internPeriod.internPeriod.name,
  );

  const internPeriodsSelectItems = internPeriodStatistics?.map(
    (internPeriod) => ({
      label: internPeriod.internPeriod.name,
      value: internPeriod.internPeriod.id,
    }),
  );

  const series = [
    {
      name: "Total Candidates",
      data: internPeriodStatistics?.map(
        (internPeriod) => internPeriod.totalCandidates,
      ),
    },
  ] as Array<{ name: string; data: number[] }>;

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
      categories: internPeriods,
    },
    yaxis: {
      title: {
        text: "Total Candidates",
      },
    },
  };

  const internPeriodMetricsOptions: ApexOptions = {
    chart: {
      type: "donut",
      id: "InterviewMetrics",
    },
    labels: ["Pass Rate", "Fail Rate"],
    fill: {
      opacity: 1,
      colors: ["#58A9FB", "#48E970", "#F31260"],
    },
  };

  const selectedInternPeriodStatistics = internPeriodStatistics?.find(
    (internPeriod) => internPeriod.internPeriod.id === selectedInternPeriod,
  );

  const internPeriodMetricsSeries = selectedInternPeriodStatistics
    ? [
        selectedInternPeriodStatistics?.passRate,
        selectedInternPeriodStatistics?.failRate,
      ]
    : [];

  return (
    <>
      <Card>
        <CardBody>
          <p className="text-xl font-semibold">Intern Period Overview</p>
          {typeof window !== "undefined" && (
            <Chart options={options} series={series} type="bar" height={350} />
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <p className="text-xl font-semibold">Intern Period Metrics</p>
          <Select
            defaultSelectedKeys={[
              internPeriodsSelectItems?.[0]?.value as string,
            ]}
            className="w-[150px]"
            label="Select intern period"
            variant="underlined"
            items={internPeriodsSelectItems}
            onSelectionChange={(keys: SharedSelection) => {
              setSelectedInternPeriod(keys.currentKey as string);
            }}
          >
            {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
          </Select>
          {typeof window !== "undefined" && (
            <Chart
              options={internPeriodMetricsOptions}
              series={internPeriodMetricsSeries}
              height={350}
              type="donut"
              key="InterviewMetrics"
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}
