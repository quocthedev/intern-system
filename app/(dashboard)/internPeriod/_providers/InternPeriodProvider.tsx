"use client";
import {
  InternPeriodFilter,
  useInternPeriod,
} from "@/data-store/intern-period";
import { createContext, useContext } from "react";

export interface InternPeriodContextInterface {
  isListInternPeriodLoading: boolean;
  listInternPeriodData:
    | {
        periods: {
          id: string;
          name: string;
          description: string;
          internshipDuration: number;
          maxCandidateQuantity: number;
          startDate: string;
          endDate: string;
        }[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined
    | null;
  refetchListInternPeriod: () => void;
  setInternPeriodPageId: (pageId: number) => void;
  setSearch: (search: string) => void;
  filter: InternPeriodFilter;
  setFilter: (newFilter: InternPeriodFilter | null) => void;
  removeOneFilter: (key: keyof InternPeriodFilter) => void;
  removeAllFilter: () => void;
}

const InternPeriodContext = createContext<InternPeriodContextInterface>(
  {} as InternPeriodContextInterface,
);

export const useInternPeriodContext = () => useContext(InternPeriodContext);

export default function InternPeriodProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isListInternPeriodLoading,
    data: listInternPeriodData,
    refetch: refetchListInternPeriod,
    setPageIndex: setInternPeriodPageId,

    setSearch,
    filter,
    setFilter,
    removeOneFilter,
    removeAllFilter,
  } = useInternPeriod({
    pageSize: 10,
  });

  return (
    <InternPeriodContext.Provider
      value={{
        isListInternPeriodLoading,
        listInternPeriodData,
        refetchListInternPeriod,
        setInternPeriodPageId,
        setSearch,
        filter: filter as InternPeriodFilter,
        setFilter,
        removeOneFilter,
        removeAllFilter,
      }}
    >
      {children}
    </InternPeriodContext.Provider>
  );
}
