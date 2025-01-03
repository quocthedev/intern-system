"use client";

import React, { useState } from "react";

import APIClient from "@/libs/api-client";
import { Pagination } from "@nextui-org/pagination";
import PositionCard from "./PositionCard";
import { usePositionContext } from "@/app/(dashboard)/position/_providers/PositionProvider";
import { Spinner } from "@nextui-org/react";

interface PositionInterface {
  id: string;
  name: string;
  abbreviation: string;
  technologies: any;
  image: string;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export default function PositionTable() {
  const {
    listPositionData,
    setPositionPageIndex,
    refetchPosition,
    isListPositionLoading,
  } = usePositionContext();

  return (
    <div>
      {isListPositionLoading ? (
        <div className="mt-20 flex items-center justify-center gap-3">
          Loading <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid h-full grid-cols-3 gap-5">
          {listPositionData?.positions &&
            listPositionData?.positions?.map((position: any) => (
              <PositionCard
                data={position}
                refetch={refetchPosition}
                key={position.id as string}
              />
            ))}
        </div>
      )}

      {listPositionData ? (
        <Pagination
          className="m-4 flex justify-center"
          isCompact
          loop
          showControls
          total={
            listPositionData?.totalPages
              ? Number(listPositionData.totalPages)
              : 0
          }
          initialPage={listPositionData?.pageIndex}
          onChange={(page) => {
            setPositionPageIndex(page);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
