"use client";
import { usePosition } from "@/data-store/position.store";
import { useContext, createContext } from "react";

export interface PositionContextInterface {
  setPositionPageIndex: (pageIndex: number) => void;
  isListPositionLoading: boolean;
  listPositionData:
    | {
        positions: {
          name: string;
          abbreviation: string;
          image: string;
          technologies: string[];
          id: string;
          dateCreate: string;
          dateUpdate: string;
          isDeleted: boolean;
        }[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined
    | null;
  refetchPosition: () => void;
  setSearch: (search: string) => void;
}

const PositionContext = createContext<PositionContextInterface>(
  {} as PositionContextInterface,
);

export const usePositionContext = () => useContext(PositionContext);

export default function PositionProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isListPositionLoading,
    data: listPositionData,
    refetch: refetchPosition,
    setPageIndex: setPositionPageIndex,
    setSearch,
  } = usePosition({
    pageSize: 6,
  });

  return (
    <PositionContext.Provider
      value={{
        isListPositionLoading,
        listPositionData,
        refetchPosition,
        setPositionPageIndex,
        setSearch,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
}
