"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { Spinner } from "@nextui-org/spinner";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { getCookie } from "@/app/util";

export const TechCard = () => {
  const defaultId = "e7a7142d-72cf-4a9d-bcb7-389c1278db6b";
  const accessToken = getCookie("accessToken");

  const [positionId, setPositionId] = useState(defaultId);
  const { data } = useQuery({
    queryKey: ["allPositions", positionId],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.position}?pageSize=100`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const result = await response.json();

        return result?.data?.pagingData || [];
      } catch (err) {
        throw new Error("Failed to fetch positions");
      }
    },
  });

  const positionData = data || [];
  const {
    isLoading: isTechnologyLoading,
    data: technologyData,
    refetch: refetchTechnology,
  } = useQuery({
    queryKey: ["technology", positionId],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.interviewQuestion}/position/${positionId}/technologies`,
      );
      const technology = await response.json();

      return technology?.data?.technologies || [];
    },
    enabled: !!positionId,
  });

  console.log(technologyData);

  const handleSelectPosition = async (id: any) => {
    refetchTechnology();
    setPositionId(id);
  };

  useEffect(() => {
    handleSelectPosition(defaultId);
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <span className="font-semibold text-lime-700 sm:-mr-1">
          Selected Position:
        </span>

        <Autocomplete
          variant="bordered"
          className="w-3/10 mb-4 mt-3 sm:mb-4 sm:mt-3"
          defaultItems={positionData}
          placeholder="Select a position"
          defaultSelectedKey={positionId}
          onSelectionChange={(id) => handleSelectPosition(id)}
        >
          {(positionData: any) => (
            <AutocompleteItem key={positionData.id}>
              {positionData.name}
            </AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      {isTechnologyLoading ? (
        <div className="mt-20 flex items-center justify-center gap-3">
          <Spinner size="lg" />
          Loading...
        </div>
      ) : (
        <div className="grid h-full grid-cols-3 gap-5">
          {technologyData &&
            technologyData.map((tech: any) => (
              <Card key={tech.id} className="w-full">
                <CardHeader>
                  <div className="flex w-full justify-between">
                    <div className="text-md font-bold">
                      {tech.technologyName}
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  {tech.image ? (
                    <Image
                      width={200}
                      height={200}
                      alt={`${tech.name} Image`}
                      src={tech.image}
                      className="grounded-md h-40 w-full object-contain"
                    />
                  ) : (
                    <Image
                      width={200}
                      height={200}
                      alt="Default Tech Image"
                      src="/icons/technology/noimg.png"
                      className="grounded-md h-40 w-full object-contain"
                    />
                  )}

                  <CardFooter className="flex justify-between text-sm">
                    <Link href={`/question/${tech.id}`}>
                      <Button
                        className="tfont-semibold bg-gray-400 text-white"
                        size="sm"
                      >
                        View Question Bank
                      </Button>
                    </Link>
                    <div className="text-green-600">Question: {tech.count}</div>
                  </CardFooter>
                </CardBody>
              </Card>
            ))}
        </div>
      )}
    </>
  );
};
