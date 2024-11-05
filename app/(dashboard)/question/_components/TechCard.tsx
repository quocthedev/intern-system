"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Checkbox } from "@nextui-org/checkbox";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/libs/config";
import { Spinner } from "@nextui-org/spinner";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { EditIcon } from "@/app/(dashboard)/question/_components/Icons";

const cardData = [
  {
    id: 1,
    name: "Nodejs",
    imgeSrc:
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    questionCount: 20,
  },
  {
    id: 2,
    name: "Reactjs",
    imgeSrc:
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    questionCount: 20,
  },
  {
    id: 3,
    name: "AWS",
    imgeSrc:
      "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    questionCount: 20,
  },
];

export const TechCard = () => {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const technology = await fetch(apiEndpoints.technology).then((res) =>
        res.json(),
      );

      const position = await fetch(apiEndpoints.position).then((res) =>
        res.json(),
      );

      return {
        technologys: technology?.data?.pagingData,
        positions: position?.data?.pagingData || [],
      };
    },
  });

  const technologyData = data?.technologys || [];
  const positionData = data?.positions || [];
  // const [selectedKeys, setSelectedKeys] = React.useState(new Set());
  // const [selectedName, setSelectedName] = React.useState("");

  // const handleSelectionChange = (id: any) => {
  //   setSelectedKeys(id);

  //   const selectedItem = positionData.find(
  //     (pos: any) => pos.id === Array.from(id)[0],
  //   );
  //   setSelectedName(selectedItem?.name || "");
  // };

  // const { data: positionById } = useQuery({
  //   queryKey: ["positionName"],
  //   queryFn: async () => {
  //     const id = selectedKeys;
  //     const position = await fetch(apiEndpoints.position + "/" + id).then(
  //       (res) => res.json(),
  //     );

  //     return position?.data;
  //   },
  // });
  // console.log(selectedName);

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="bordered">Select</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dynamic Actions"
          items={positionData}
          selectionMode="single"
          // selectedKeys={selectedKeys}
          // onSelectionChange={handleSelectionChange}
        >
          {(pos: any) => <DropdownItem key={pos.id}>{pos.name}</DropdownItem>}
        </DropdownMenu>
      </Dropdown>

      <div className="grid h-full grid-cols-3 gap-5">
        {technologyData.map((tech: any) => (
          <Card key={tech.id} className="w-full">
            <CardHeader>
              <div className="flex w-full justify-between">
                <div className="text-md font-bold">{tech.name}</div>

                <div className="flex space-x-1">
                  <EditIcon /> <span>Edit</span>
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {/* <Image
                className="my-3 ml-10"
                width={200}
                height={200}
                alt="Nodejs Image"
                src={tech.imgeSrc}
              /> */}

              <Divider />

              <CardFooter className="flex justify-between text-sm">
                <Button
                  className="tfont-semibold bg-gray-400 text-white"
                  size="sm"
                  href="/"
                >
                  View Question Bank
                </Button>
                <div className="text-green-600">
                  {/* Question: {tech.questionCount} */}
                </div>
              </CardFooter>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
};
