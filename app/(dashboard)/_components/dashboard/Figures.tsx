"use client";
import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { FigureIcon } from "./Icons";
import { cn } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import Loading from "@/components/Loading";
import { BaseResponse, BaseResponseSuccess } from "@/libs/types";

type FigureProps = {
  className?: string;
};

export type Overview = {
  totalUniversities: number;
  totalCandidatesCompleted: number;
  totalCandidatesInProgress: number;
  totalProjects: number;
  passRate: number;
  failRate: number;
};

const OverviewMapping: Record<string, string> = {
  totalUniversities: "Total Universities",
  totalCandidatesCompleted: "Total Candidates Completed",
  totalCandidatesInProgress: "Total Candidates In Progress",
  totalProjects: "Total Projects",
  passRate: "Pass Rate",
  failRate: "Fail Rate",
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

export default function Figures({ className }: FigureProps) {
  const { data: figures, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const response = await apiClient.get<BaseResponse<Overview>>(
        API_ENDPOINTS.statistic + "/overview",
      );

      if (response.statusCode === "200") {
        const { data } = response as BaseResponseSuccess<Overview>;

        return data;
      }

      return null;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={cn("grid w-full grid-cols-3 gap-6", className)}>
      {Object.entries(figures || {}).map(
        ([figure, value]: [string, number], index: number) => (
          <Card key={index}>
            <CardBody>
              <div className="flex items-center gap-4">
                <FigureIcon size={56} />
                <div className="flex flex-col">
                  <p className="text-xs text-grey">{OverviewMapping[figure]}</p>
                  <p className="text-xl font-semibold">
                    {figure === "passRate" || figure === "failRate"
                      ? `${value} %`
                      : value}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ),
      )}
    </div>
  );
}
