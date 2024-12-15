"use client";
import { useUniversity } from "@/data-store/university";
import { useContext, createContext } from "react";

export interface UniversityContextInterface {
  setUniversityPageIndex: (pageIndex: number) => void;
  isListUniversityLoading: boolean;
  listUniversityData:
    | {
        universities: {
          id: string;
          name: string;
          abbreviation: string;
          address: string;
          image: string;
        }[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined
    | null;
  refetchListUniversity: () => void;
  setSearch: (search: string) => void;
}

const UniversityContext = createContext<UniversityContextInterface>(
  {} as UniversityContextInterface,
);

export const useUniversityContext = () => useContext(UniversityContext);

export default function UniversityProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isListUniversityLoading,
    data: listUniversityData,
    refetch: refetchListUniversity,
    setPageIndex: setUniversityPageIndex,

    setSearch,
  } = useUniversity({
    pageSize: 6,
  });

  return (
    <UniversityContext.Provider
      value={{
        isListUniversityLoading,
        listUniversityData,
        refetchListUniversity,
        setUniversityPageIndex,
        setSearch,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}
