"use client";
import {
  InternPeriod,
  useInternPeriodDetail,
} from "@/data-store/intern-period/detail";

import { useParams } from "next/navigation";
import { createContext, useContext } from "react";

export interface InternPeriodContextInterface {
  isInternPeriodLoading: boolean;
  internPeriodData: InternPeriod | null | undefined;
  refetchInternPeriod: () => void;
  periodId: string;
}

const InternPeriodContext = createContext<InternPeriodContextInterface>(
  {} as InternPeriodContextInterface,
);

export const useInternPeriodContext = () => useContext(InternPeriodContext);

export default function InternPeriodProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const { periodId } = useParams();

  const {
    isLoading: isInternPeriodLoading,
    data: internPeriodData,
    refetch: refetchInternPeriod,
  } = useInternPeriodDetail({
    id: periodId as string,
  });

  return (
    <InternPeriodContext.Provider
      value={{
        isInternPeriodLoading: isInternPeriodLoading,
        internPeriodData: internPeriodData,
        refetchInternPeriod: refetchInternPeriod,
        periodId: periodId as string,
      }}
    >
      {children}
    </InternPeriodContext.Provider>
  );
}
