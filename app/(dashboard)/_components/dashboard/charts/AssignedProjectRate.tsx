"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Card, CardBody, Select, SelectItem } from "@nextui-org/react";
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

export type ProjectParticipant = {
  totalCandidates: number;
  candidatesAssigned: number;
  candidatesNotAssigned: number;
};

export default function AssignedProjectRate() {
  const { data: figures, isLoading } = useQuery({
    queryKey: ["statistic", "project-participant"],
    queryFn: async () => {
      const response = await apiClient.get<BaseResponse<ProjectParticipant>>(
        API_ENDPOINTS.statistic + "/project-participant",
      );

      if (response.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<ProjectParticipant>;

        return data;
      }

      return null;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

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

  const series = figures
    ? [figures.candidatesAssigned, figures.candidatesNotAssigned]
    : [0, 0];

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
