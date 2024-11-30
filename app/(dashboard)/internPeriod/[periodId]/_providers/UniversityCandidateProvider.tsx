"use client";
import {
  UniversityCandidate,
  useUniversityCandidate,
} from "@/data-store/candidate/university-candidate";

import { createContext, useContext } from "react";

export interface UniversityCandidateContextInterface {
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
  universityId: string;
}

const UniversityCandidateContext =
  createContext<UniversityCandidateContextInterface>(
    {} as UniversityCandidateContextInterface,
  );

export const useUniversityCandidateContext = () =>
  useContext(UniversityCandidateContext);

export default function UniversityCandidateProvider({
  children,
  universityId,
}: React.PropsWithChildren<{
  universityId: string;
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
  } = useUniversityCandidate({
    pageSize: 5,
    universityId,
  });

  return (
    <UniversityCandidateContext.Provider
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
        universityId,
      }}
    >
      {children}
    </UniversityCandidateContext.Provider>
  );
}
