"use client";
import {
  UniversityCandidate,
  useApprovedUniversityCandidate,
} from "@/data-store/candidate/university-candidate";

import { createContext, useContext } from "react";

export interface ApprovedUniversityCandidateContextInterface {
  isLoading: boolean;
  error: Error | null;
  data:
    | {
        candidates: UniversityCandidate[];
        pageIndex: number;
        totalPages: number;
      }
    | null
    | undefined;
  refetch: () => void;
  setPageIndex: (pageIndex: number) => void;
  setSearch: (search: string) => void;
  filter: any;
  setFilter: (newFilter: any) => void;
  removeOneFilter: (key: "Status" | "Gender") => void;
  removeAllFilter: () => void;
  internPeriodId: string;
  universityId: string;
}

const ApprovedUniversityCandidateContext =
  createContext<ApprovedUniversityCandidateContextInterface>(
    {} as ApprovedUniversityCandidateContextInterface,
  );

export const useApprovedUniversityCandidateContext = () =>
  useContext(ApprovedUniversityCandidateContext);

export default function ApprovedUniversityCandidateProvider({
  children,
  internPeriodId,
  universityId,
}: React.PropsWithChildren<{
  internPeriodId: any;
  universityId: any;
}>) {
  const {
    isLoading,
    error,
    data,
    refetch,
    setPageIndex,
    setSearch,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  } = useApprovedUniversityCandidate({
    pageSize: 10,
    internPeriodId,
    universityId,
  });

  return (
    <ApprovedUniversityCandidateContext.Provider
      value={{
        isLoading,
        error,
        data,
        refetch,
        setPageIndex,
        setSearch,
        filter,
        setFilter,
        removeOneFilter,
        removeAllFilter,
        internPeriodId,
        universityId,
      }}
    >
      {children}
    </ApprovedUniversityCandidateContext.Provider>
  );
}
