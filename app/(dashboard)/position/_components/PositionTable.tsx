"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query"; //get request
import { API_ENDPOINTS } from "@/libs/config";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import APIClient from "@/libs/api-client";
import { Pagination } from "@nextui-org/pagination";
import PositionCard from "./PositionCard";
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
  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 6;

  const { error, data, refetch, isLoading } = useQuery({
    queryKey: ["position", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<PositionInterface>
      >(API_ENDPOINTS.position, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<PositionInterface>;

        return {
          positions: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });

  if (error) {
    return <div>Error + {error.message}</div>;
  }

  return (
    <div>
      {isLoading ? (
        <div className="mt-20 flex items-center justify-center gap-3">
          Loading <Spinner size="lg" />
        </div>
      ) : (
        <div>
          <div className="grid h-full grid-cols-3 gap-5">
            {data?.positions &&
              data.positions.map((position: PositionInterface) => (
                <PositionCard
                  data={position}
                  refetch={refetch}
                  key={position.id as string}
                />
              ))}
          </div>
          <Pagination
            className="m-4 flex justify-center"
            isCompact
            loop
            showControls
            total={data?.totalPages ? Number(data.totalPages) : 0}
            initialPage={pageIndex}
            onChange={(page) => {
              setPageIndex(page);
            }}
          />
        </div>
      )}
    </div>
  );
}
