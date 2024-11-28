"use client";

import React, { createContext, useState } from "react";
import Figures from "./_components/dashboard/Figures";
import Charts from "./_components/dashboard/Charts";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";

export const StatisticsContext = createContext<any | null>(null);
export default function DashboardPage() {
  const [currentSelectedPeriod, setCurrentSelectedPeriod] = useState();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data", currentSelectedPeriod],
    queryFn: async () => {
      const [internPe, statics] = await Promise.all([
        fetch(API_ENDPOINTS.internPeriod),
        fetch(API_ENDPOINTS.statistic + "/" + currentSelectedPeriod),
      ]);

      const internPeriod = await internPe.json();
      const statistics = await statics.json();

      return {
        period: internPeriod?.data?.pagingData || [],
        stat: statistics?.data || [],
      };
    },
  });

  const periodData = data?.period || [];
  const periodDataId = periodData?.map((item: { id: string }) => item.id);

  console.log(periodDataId);

  const statisticData = data?.stat || [];

  const statisticsContextValue = {
    periods: periodData,
    statistics: statisticData,
    currentSelectedPeriod: currentSelectedPeriod,
    setCurrentSelectedPeriod: setCurrentSelectedPeriod,
  };

  return (
    <StatisticsContext.Provider value={statisticsContextValue}>
      <div className="flex h-full w-full flex-col gap-4 p-9">
        {JSON.stringify(currentSelectedPeriod)}
        <h1 className="text-left text-2xl font-semibold capitalize text-black">
          Dashboard
        </h1>

        <Figures className="mt-4" />
        <Charts />
      </div>
    </StatisticsContext.Provider>
  );
}
