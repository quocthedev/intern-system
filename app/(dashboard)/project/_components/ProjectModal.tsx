"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/date-picker";
import { createNewProject } from "@/actions/create-new-project";
import { Project } from "../_types/Project";
import { getLocalTimeZone, now, parseDate } from "@internationalized/date";
import * as R from "ramda";
import { usePosition } from "@/data-store/position.store";
import SelectSearch, { SelectSearchItem } from "@/components/SelectSearch";
import { useTechnology } from "@/data-store/technology.store";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import axios from "axios";

export type ProjectModalProps = {
  selectedProjectInfo?: Project;
  className?: string;
  mode: "create" | "edit";
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetch?: () => void;
  onClose?: () => void;
};

export async function updateProject(params: {
  projectId: string;
  updateData: Partial<
    Project & {
      addingPositions: string[];
      removingPositions: string[];
      addingTechnologies: string[];
      removingTechnologies: string[];
    }
  >;
}) {
  const {
    addingPositions,
    removingPositions,
    addingTechnologies,
    removingTechnologies,
    ...updateProjectParams
  } = params.updateData;

  const requestBody = {
    ...updateProjectParams,
    ...(R.compose(
      R.fromPairs,
      R.map(([key, value]) => [key, new Date(value).toISOString()]) as never,
      R.toPairs as never,
      R.pick(["startDate", "releaseDate"]) as never,
    )(updateProjectParams) as any),
  };

  const requests = [];

  if (addingPositions) {
    requests.push(
      axios.post(
        API_ENDPOINTS.project + `/${params.projectId}/add-positions`,
        addingPositions.map((id) => ({ positionId: id })),
      ),
    );
  }

  if (removingPositions) {
    requests.push(
      removingPositions.map((id) =>
        axios.delete(
          API_ENDPOINTS.project + `/${params.projectId}/position/${id}`,
        ),
      ),
    );
  }

  if (addingTechnologies) {
    requests.push(
      axios.post(
        API_ENDPOINTS.project + `/${params.projectId}/add-technologies`,
        addingTechnologies.map((id) => ({ technologyId: id })),
      ),
    );
  }

  if (removingTechnologies) {
    removingTechnologies.map((id) =>
      axios.delete(
        API_ENDPOINTS.project + `/${params.projectId}/technology/${id}`,
      ),
    );
  }

  await fetch(API_ENDPOINTS.project + `/${params.projectId}`, {
    method: "PUT",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await Promise.all([...requests]);
}

export default function ProjectModal(props: ProjectModalProps) {
  const updateProjectMutation = useMutation({
    mutationFn: async (params: {
      projectId: string;
      updateData: Partial<
        Project & {
          addingPositions: string[];
          removingPositions: string[];
          addingTechnologies: string[];
          removingTechnologies: string[];
        }
      >;
    }) => {
      const {
        addingPositions,
        removingPositions,
        addingTechnologies,
        removingTechnologies,
        ...updateProjectParams
      } = params.updateData;

      const requestBody = {
        ...updateProjectParams,
        ...(R.compose(
          R.fromPairs,
          R.map(([key, value]) => [
            key,
            new Date(value).toISOString(),
          ]) as never,
          R.toPairs as never,
          R.pick(["startDate", "releaseDate"]) as never,
        )(updateProjectParams) as any),
      };

      const requests = [];

      if (addingPositions) {
        requests.push(
          axios.post(
            API_ENDPOINTS.project + `/${params.projectId}/add-positions`,
            addingPositions.map((id) => ({ positionId: id })),
          ),
        );
      }

      if (removingPositions) {
        requests.push(
          removingPositions.map((id) =>
            axios.delete(
              API_ENDPOINTS.project + `/${params.projectId}/position/${id}`,
            ),
          ),
        );
      }

      if (addingTechnologies) {
        requests.push(
          axios.post(
            API_ENDPOINTS.project + `/${params.projectId}/add-technologies`,
            addingTechnologies.map((id) => ({ technologyId: id })),
          ),
        );
      }

      if (removingTechnologies) {
        removingTechnologies.map((id) =>
          axios.delete(
            API_ENDPOINTS.project + `/${params.projectId}/technology/${id}`,
          ),
        );
      }

      // throw new Error("Error");

      const response = await fetch(
        API_ENDPOINTS.project + `/${params.projectId}`,
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        },
      ).then((response) => response.json());

      if (response.statusCode !== 200) {
        return {
          error: response.message,
        };
      }

      await Promise.all([...requests]);
    },
  });

  const {
    isLoading: isPositionsLoading,
    setSearch: setPositionSearch,
    dynamicPositionList,
    scrollerRef: positionScrollerRef,
    setIsOpen: setIsOpenPositionSearch,
    isOpen: isOpenPositionSearch,
  } = usePosition({ pageSize: 8 });

  const positions = dynamicPositionList || [];

  const {
    isLoading: isTechnologiesLoading,
    setSearch: setTechnologySearch,
    dynamicTechnologyList,
    scrollerRef: technologyScrollerRef,
    setIsOpen: setIsOpenTechnologySearch,
    isOpen: isOpenTechnologySearch,
  } = useTechnology({ pageSize: 8 });

  const technologies = dynamicTechnologyList || [];

  const [selectedPositions, setSelectedPositions] = useState<
    Array<SelectSearchItem>
  >(
    (props.selectedProjectInfo?.listPosition || []).map((position) => ({
      key: position.id,
      value: position.name,
      label: position.name,
      chipLabel: position.abbreviation,
    })),
  );

  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Array<SelectSearchItem>
  >(
    (props.selectedProjectInfo?.listTechnology || []).map((technology) => ({
      key: technology.id,
      value: technology.name,
      label: technology.name,
      chipLabel: technology.abbreviation,
    })),
  );

  const submit = async (formData: FormData) => {
    selectedPositions.forEach((position) => {
      formData.append("positions", position.key);
    });

    selectedTechnologies.forEach((technology) => {
      formData.append("technologies", technology.key);
    });

    if (props.mode === "create") {
      const res = (await createNewProject(formData)) as any;

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Project created successfully");
        props.onClose?.();
      }

      props.refetch?.();
    } else {
      const updatedFields = {} as Partial<Project>;

      const oldData = {
        ...props.selectedProjectInfo,
        startDate: props.selectedProjectInfo?.startDate.split("T")[0] as string,
        releaseDate: props.selectedProjectInfo?.releaseDate.split(
          "T",
        )[0] as string,
      } as Project;

      for (const [key, value] of formData.entries()) {
        if (key === "positions" || key === "technologies") {
          continue;
        }

        const projectKey = key as keyof Project;

        updatedFields[projectKey] = value as any;
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

      const filteredParams = {
        ...(R.filter((value) => value.length > 0, params) as Record<
          string,
          any
        >),
        ...updatedFields,
      };

      const res = await updateProjectMutation.mutateAsync({
        projectId: props.selectedProjectInfo?.id as string,
        updateData: filteredParams,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Project updated successfully");

        props.onClose?.();
      }
    }
  };

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
              <form
                className={"flex flex-col gap-5"}
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

                <SelectSearch
                  label="Positions"
                  placeholder="Select positions"
                  selectionMode="multiple"
                  isLoading={isPositionsLoading}
                  items={(positions || []).map((position) => ({
                    key: position.id,
                    value: position.name,
                    label: position.name,
                    chipLabel: position.abbreviation,
                  }))}
                  required
                  inputSearchPlaceholder="Search positions by name"
                  scrollRef={positionScrollerRef}
                  onSearchChange={setPositionSearch}
                  isOpen={isOpenPositionSearch}
                  setIsOpen={setIsOpenPositionSearch}
                  selectedItems={selectedPositions}
                  setSelectedItems={setSelectedPositions}
                />
                {/* Add SelectSearch for technologies */}
                <SelectSearch
                  label="Technologies"
                  placeholder="Select technologies"
                  selectionMode="multiple"
                  isLoading={isTechnologiesLoading}
                  items={(technologies || []).map((technology) => ({
                    key: technology.id,
                    value: technology.name,
                    label: technology.name,
                    chipLabel: technology.abbreviation,
                  }))}
                  required
                  inputSearchPlaceholder="Search technologies by name"
                  scrollRef={technologyScrollerRef}
                  onSearchChange={setTechnologySearch}
                  isOpen={isOpenTechnologySearch}
                  setIsOpen={setIsOpenTechnologySearch}
                  selectedItems={selectedTechnologies}
                  setSelectedItems={setSelectedTechnologies}
                />

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
