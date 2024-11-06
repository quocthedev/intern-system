"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Checkbox } from "@nextui-org/checkbox";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/libs/config";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { EditIcon } from "@/app/(dashboard)/question/_components/Icons";

export const TechCard = () => {
  const defaultId = "b539ab8f-999d-4ee4-bfa5-ce0578063171";
  const [positionId, setPositionId] = useState(defaultId);
  const [technology, setTechnology] = useState([]);

  console.log(positionId);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data", positionId],
    queryFn: async () => {
      const position = await fetch(apiEndpoints.position).then((res) =>
        res.json(),
      );

      return {
        positions: position?.data?.pagingData || [],
      };
    },
  });

  const positionData = data?.positions || [];

  const fetchTechnologyData = async (positionId: any) => {
    if (!positionId) return;

    const response = await fetch(
      `${apiEndpoints.interviewQuestion}/position/${positionId}/technologies/interview-questions`,
    );
    const technology = await response.json();

    console.log("Fetched technology data:", technology?.data);

    return technology?.data;
  };

  const handleSelectPosition = async (id: any) => {
    const technology = await fetchTechnologyData(id);
    setTechnology(technology.technologies);
    console.log(technology.technologies);
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
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">
            {positionId ? getPositionNameById(positionId) : "Select"}
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

      <div className="grid h-full grid-cols-3 gap-5">
        {technology &&
          technology.map((tech: any) => (
            <Card key={tech.id} className="w-full">
              <CardHeader>
                <div className="flex w-full justify-between">
                  <div className="text-md font-bold">{tech.technologyName}</div>

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
                  <div className="text-green-600">
                    Question: {tech.questionCount}
                  </div>
                </CardFooter>
              </CardBody>
            </Card>
          ))}
      </div>
    </>
  );
};
