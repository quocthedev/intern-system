"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
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
import { Project } from "../_types/Project";
import { getLocalTimeZone, now, parseDate } from "@internationalized/date";
import * as R from "ramda";
import { updateProject } from "@/actions/update-project";
import { cn } from "@nextui-org/theme";
const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    // console.error(error);
    // return Promise.reject(error);

    console.log(error.response.data);
  },
});

export type ProjectModalProps = {
  selectedProjectInfo?: Project;
  className?: string;
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetch?: () => void;
};

export default function ProjectModal(props: ProjectModalProps) {
  const [isProcessingForm, setIsProcessing] = useState(false);
  const [formMessage, setFormMessage] = useState("Processing...");

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

  // use react-query mutation to handle form submission

  const submit = async (formData: FormData) => {
    setIsProcessing(true);
    try {
      if (props.mode === "create") {
        await createNewProject(formData);
        setFormMessage("Successfully submitted!");

        setIsProcessing(false);
        props.refetch?.();
      } else {
        const updatedFields = {} as Partial<Project>;

        const oldData = {
          ...props.selectedProjectInfo,
          startDate: props.selectedProjectInfo?.startDate.split(
            "T",
          )[0] as string,
          releaseDate: props.selectedProjectInfo?.releaseDate.split(
            "T",
          )[0] as string,
        } as Project;

        for (const [key, value] of formData.entries()) {
          if (key === "positions" || key === "technologies") {
            continue;
          }

          const projectKey = key as keyof Project;

          if (oldData[projectKey] !== value) {
            updatedFields[projectKey] = value as any;
          }
        }

        const params = {} as Record<string, any>;

        params["addingPositions"] = R.difference(
          formData.getAll("positions"),
          oldData.listPosition.map((position) => position.id),
        );

        params["removingPositions"] = R.difference(
          oldData.listPosition.map((position) => position.id),
          formData.getAll("positions"),
        );

        params["addingTechnologies"] = R.difference(
          formData.getAll("technologies"),
          oldData.listTechnology.map((technology) => technology.id),
        );

        params["removingTechnologies"] = R.difference(
          oldData.listTechnology.map((technology) => technology.id),
          formData.getAll("technologies"),
        );
        // Remove fields with values as empty array

        const filteredParams = {
          ...(R.filter((value) => value.length > 0, params) as Record<
            string,
            any
          >),
          ...updatedFields,
        };

        await updateProject({
          projectId: props.selectedProjectInfo?.id as string,
          updateData: filteredParams,
        });
        setFormMessage("Successfully submitted!");

        setIsProcessing(false);
        props.refetch?.();
      }
    } catch (error) {
      setFormMessage("An error occurred!");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessing(false);
    }
  };

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
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      className="max-w-fit"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {props.mode === "create"
                ? "Add New Project"
                : "Edit Project: " + props.selectedProjectInfo?.title}
            </ModalHeader>

            <ModalBody className="w-[800px]">
              <p
                className={cn(
                  "hidden text-black",
                  isProcessingForm ? "block" : "",
                )}
              >
                {formMessage}
              </p>
              <form
                className={cn(
                  "flex flex-col gap-5",
                  isProcessingForm ? "hidden" : "",
                )}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);

                  submit(formData);
                }}
              >
                <Input
                  label="Project title"
                  placeholder="Enter project title"
                  labelPlacement="outside"
                  name="title"
                  defaultValue={props.selectedProjectInfo?.title}
                  required
                />
                <Input
                  label="Product URL"
                  placeholder="Enter product URL"
                  labelPlacement="outside"
                  name="productUri"
                  defaultValue={props.selectedProjectInfo?.productUri}
                  required
                />
                <Input
                  label="Zalo URL"
                  placeholder="Enter Zalo URL"
                  labelPlacement="outside"
                  name="zaloUri"
                  defaultValue={props.selectedProjectInfo?.zaloUri}
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
                  defaultSelectedKeys={props.selectedProjectInfo?.listPosition.map(
                    (position) => position.id,
                  )}
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
                  defaultSelectedKeys={props.selectedProjectInfo?.listTechnology.map(
                    (technology) => technology.id,
                  )}
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
                    granularity="day"
                    defaultValue={
                      props.mode === "create"
                        ? now(getLocalTimeZone())
                        : parseDate(
                            props.selectedProjectInfo?.startDate.split(
                              "T",
                            )[0] as string,
                          )
                    }
                  />

                  <DatePicker
                    label="Release date"
                    labelPlacement="outside"
                    name="releaseDate"
                    isRequired
                    showMonthAndYearPickers
                    granularity="day"
                    defaultValue={
                      props.mode === "create"
                        ? now(getLocalTimeZone())
                        : parseDate(
                            props.selectedProjectInfo?.releaseDate.split(
                              "T",
                            )[0] as string,
                          )
                    }
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
  );
}
