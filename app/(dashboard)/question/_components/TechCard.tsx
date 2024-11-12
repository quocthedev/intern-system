"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { EditIcon } from "@/app/(dashboard)/question/_components/Icons";
import { Spinner } from "@nextui-org/spinner";

export const TechCard = () => {
  const defaultId = "b539ab8f-999d-4ee4-bfa5-ce0578063171";

  const [positionId, setPositionId] = useState(defaultId);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data", positionId],
    queryFn: async () => {
      const position = await fetch(API_ENDPOINTS.position).then((res) =>
        res.json(),
      );

      return {
        positions: position?.data?.pagingData || [],
      };
    },
  });

  const positionData = data?.positions || [];

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
    enabled: !!positionId, // Only run query when positionId is set
  });

  const handleSelectPosition = async (id: any) => {
    refetchTechnology();
    setPositionId(id);
  };

  useEffect(() => {
    handleSelectPosition(defaultId);
  }, []);

  const getPositionNameById = (id: any) => {
    const position = positionData.find((pos: any) => pos.id === id);

    return position?.name;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <span className="font-semibold text-lime-700 sm:-mr-1">
          Selected Position:
        </span>
        <Dropdown>
          <DropdownTrigger className="mb-4 mt-3 sm:mb-4 sm:mt-3">
            <Button variant="bordered" className="text-sm">
              {isLoading ? (
                <Spinner size="sm" />
              ) : positionId ? (
                getPositionNameById(positionId)
              ) : (
                "Select"
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dynamic Actions"
            items={positionData}
            selectionMode="single"
            onAction={(id) => handleSelectPosition(id)}
          >
            {(pos: any) => <DropdownItem key={pos.id}>{pos.name}</DropdownItem>}
          </DropdownMenu>
        </Dropdown>
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

                    <div className="flex space-x-1">
                      <EditIcon /> <span>Edit</span>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Image
                    className="my-3 ml-10"
                    width={200}
                    height={200}
                    alt="Nodejs Image"
                    src={tech.imgeSrc}
                  />

                  <Divider />

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
