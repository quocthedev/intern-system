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
import APIClient from "@/libs/api-client";
import { GetPositionResponse, Position } from "../_types/Position";
import { API_ENDPOINTS } from "@/libs/config";
import { PaginationResponseSuccess } from "@/libs/types";
import { GetTechnologyResponse, Technology } from "../_types/Technology";
import { createNewProject } from "@/actions/create-new-project";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    // console.error(error);
    // return Promise.reject(error);

    console.log(error.response.data);
  },
});

export default function NewProjectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    isLoading: isPositionsLoading,
    error: positionsError,
    data: positions,
  } = useQuery({
    queryKey: ["positions"],
    queryFn: async () => {
      const response = await apiClient.get<GetPositionResponse>(
        API_ENDPOINTS.position,
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Position>;

        return data.pagingData;
      }

      return [];
    },
  });

  const {
    isLoading: isTechnologiesLoading,
    error: technologiesError,
    data: technologies,
  } = useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const response = await apiClient.get<GetTechnologyResponse>(
        API_ENDPOINTS.technology,
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Technology>;

        return data.pagingData;
      }

      return [];
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

              <ModalBody className="w-[800px]">
                <form
                  className="flex flex-col gap-5"
                  action={async (formData: FormData) => {
                    createNewProject(formData);
                  }}
                >
                  <Input
                    label="Project title"
                    placeholder="Enter project title"
                    labelPlacement="outside"
                    name="title"
                    required
                  />
                  <Input
                    label="Product URL"
                    placeholder="Enter product URL"
                    labelPlacement="outside"
                    name="productUri"
                    required
                  />
                  <Input
                    label="Zalo URL"
                    placeholder="Enter Zalo URL"
                    labelPlacement="outside"
                    name="zaloUri"
                    required
                  />
                  <Select
                    label="Positions"
                    placeholder="Select positions"
                    selectionMode="multiple"
                    isLoading={isPositionsLoading}
                    items={positions || []}
                    labelPlacement="outside"
                    name="positions"
                    required
                  >
                    {(position) => (
                      <SelectItem key={position.id} value={position.name}>
                        {position.name}
                      </SelectItem>
                    )}
                  </Select>

                  <Select
                    label="Technologies"
                    placeholder="Select technologies"
                    selectionMode="multiple"
                    isLoading={isTechnologiesLoading}
                    items={technologies || []}
                    labelPlacement="outside"
                    name="technologies"
                    required
                  >
                    {(technology) => (
                      <SelectItem key={technology.id} value={technology.name}>
                        {technology.name}
                      </SelectItem>
                    )}
                  </Select>

                  <div className="flex w-full gap-3">
                    <DatePicker
                      label="Start date"
                      labelPlacement="outside"
                      name="startDate"
                      isRequired
                    />
                    <DatePicker
                      label="Release date"
                      labelPlacement="outside"
                      name="releaseDate"
                      isRequired
                    />
                  </div>
                  <Button color="primary" className="w-full" type="submit">
                    Submit
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
