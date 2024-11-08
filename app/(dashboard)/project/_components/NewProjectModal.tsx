"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { AddIcon } from "./Icons";
import { Input } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";
import { useQuery } from "@tanstack/react-query";

export default function NewProjectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isLoading: isPositionsLoading,
    error: positionsError,
    data: positions,
  } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      // const response = await apiClient.get<GetProjectResponse>(
      //   apiEndpoints.project,
      // );

      // if (response?.statusCode === "200") {
      //   const { data } = response as PaginationResponseSuccess<Project>;

      //   return data.pagingData;
      // }

      // return [];
      await new Promise((resolve) => setTimeout(resolve, 5000));

      return [
        {
          key: "1",
          label: "Backend Developer",
        },
        {
          key: "2",
          label: "Frontend Developer",
        },
      ];
    },
  });

  const {
    isLoading: isTechnologiesLoading,
    error: technologiesError,
    data: technologies,
  } = useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      // const response = await apiClient.get<GetProjectResponse>(
      //   apiEndpoints.project,
      // );

      // if (response?.statusCode === "200") {
      //   const { data } = response as PaginationResponseSuccess<Project>;

      //   return data.pagingData;
      // }

      // return [];

      await new Promise((resolve) => setTimeout(resolve, 5000));

      return [
        {
          key: "1",
          label: "React",
        },
        {
          key: "2",
          label: "NodeJS",
        },
        {
          key: "3",
          label: "MongoDB",
        },
      ];
    },
  });

  return (
    <>
      <Button
        color="primary"
        size="md"
        startContent={<AddIcon />}
        className="text-white"
        variant="shadow"
        onPress={onOpen}
      >
        New Project
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Project
              </ModalHeader>

              <ModalBody className="gap-5">
                <Input
                  label="Project name"
                  placeholder="Enter project name"
                  labelPlacement="outside"
                />
                <Select
                  label="Position"
                  placeholder="Select positions"
                  selectionMode="multiple"
                  isLoading={isPositionsLoading}
                  items={positions || []}
                  labelPlacement="outside"
                >
                  {(position) => (
                    <SelectItem key={position.key} value={position.key}>
                      {position.label}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  label="Technology"
                  placeholder="Select technologies"
                  selectionMode="multiple"
                  isLoading={isTechnologiesLoading}
                  items={technologies || []}
                  labelPlacement="outside"
                >
                  {(technology) => (
                    <SelectItem key={technology.key} value={technology.key}>
                      {technology.label}
                    </SelectItem>
                  )}
                </Select>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Leader"
                    placeholder="Enter username"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Sub Leader"
                    placeholder="Enter username"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Mentor"
                    placeholder="Enter username"
                    labelPlacement="outside"
                  />
                </div>

                <div className="flex w-full gap-3">
                  <DatePicker label="Start date" labelPlacement="outside" />
                  <DatePicker label="End date" labelPlacement="outside" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
