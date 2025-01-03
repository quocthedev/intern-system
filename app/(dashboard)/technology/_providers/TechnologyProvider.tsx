"use client";
import { useTechnology } from "@/data-store/technology.store";
import { useContext, createContext } from "react";
export interface TechnologyContextInterface {
  setTechnologyPageIndex: (pageIndex: number) => void;
  isListTechnologyLoading: boolean;
  listTechnologyData:
    | {
        technologies: {
          id: string;
          name: string;
          abbreviation: string;
          imageUri: string;
          description: string;
          dateCreate: string;
          dateUpdate: string;
          isDeleted: boolean;
        }[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined
    | null;
  refetchTechnology: () => void;
  setSearch: (search: string) => void;
}

const TechnologyContext = createContext<TechnologyContextInterface>(
  {} as TechnologyContextInterface,
);

export const useTechnologyContext = () => useContext(TechnologyContext);

export default function TechnologyProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isListTechnologyLoading,
    data: listTechnologyData,
    refetch: refetchTechnology,
    setPageIndex: setTechnologyPageIndex,

    setSearch,
  } = useTechnology({
    pageSize: 6,
  });

  return (
    <TechnologyContext.Provider
      value={{
        isListTechnologyLoading,
        listTechnologyData,
        refetchTechnology,
        setTechnologyPageIndex,
        setSearch,
      }}
    >
      {children}
    </TechnologyContext.Provider>
  );
}
