import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tooltip } from "@nextui-org/tooltip";
import React, { useState } from "react";
import { DeleteIcon, EditIcon } from "./Icons";
import Image from "next/image";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Divider } from "@nextui-org/divider";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import SelectSearch, { SelectSearchItem } from "@/components/SelectSearch";
import { useTechnology } from "@/data-store/technology.store";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { toast } from "sonner";

interface Tech {
  id: string;
  name: string;
}

interface PositionInterface {
  id: string;
  name: string;
  abbreviation: string;
  technologies: any;
  image: string;
}

export type PositonCardProps = {
  data: PositionInterface;
  refetch: () => void;
};

export default function PositionCard(props: PositonCardProps) {
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  const openModalDelete = (id: string) => {
    onOpenDelete();
    // setSelectedPosition(String(id));
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch(API_ENDPOINTS.position + "/" + props.data.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      props.refetch();
      onCloseEdit();
    },
  });

  const mutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.position + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json()),

    onError: (error) => {
      toast.error(error.message);
    },

    onSuccess: () => {
      props.refetch();
    },
  });

  const addTechMutation = useMutation({
    mutationFn: async (techIds: string[]) => {
      const response = await fetch(
        `${API_ENDPOINTS.position}/${props.data.id}/technologies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(techIds),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message);
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      props.refetch();
    },
  });

  const deleteTechMutation = useMutation({
    mutationFn: async (techIds: string[]) => {
      const response = await Promise.race(
        techIds.map((techId) =>
          fetch(
            `${API_ENDPOINTS.position}/${props.data.id}/technology/${techId}`,
            {
              method: "DELETE",
            },
          ),
        ),
      );

      console.log(response);

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message);
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      props.refetch();
    },
  });

  const [updateData, setUpdateData] = useState({
    name: "",
    abbreviation: "",
  });

  const handleUpdate = () => {
    updateMutation.mutate();
    // get added technologies
    const addedTechnologies = selectedTechnologies.filter(
      (tech) => !props.data.technologies.find((t: any) => t.id === tech.key),
    );

    // get removed technologies
    const removedTechnologies = props.data.technologies.filter(
      (tech: any) => !selectedTechnologies.find((t) => t.key === tech.id),
    );

    console.log(addedTechnologies, removedTechnologies);

    addTechMutation.mutate(addedTechnologies.map((tech) => tech.key));
    deleteTechMutation.mutate(removedTechnologies.map((tech: Tech) => tech.id));
  };

  const openEditModal = (
    id: React.SetStateAction<string>,
    name: string,
    abbreviation: string,
    technologies: Tech[],
  ) => {
    setUpdateData({ name, abbreviation });
    onOpenEdit();
  };

  const handleDelete = (id: string) => {
    mutation.mutate(id);
    toast.success("Deleted successfully!");
    onCloseDelete();
  };

  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
    onOpenChange: onOpenEditChange,
  } = useDisclosure();

  const {
    isLoading: isTechnologiesLoading,
    setSearch: setTechnologySearch,
    dynamicTechnologyList,
    scrollerRef: technologyScrollerRef,
    setIsOpen: setIsOpenTechnologySearch,
    isOpen: isOpenTechnologySearch,
  } = useTechnology({ pageSize: 8 });

  const defaultSelectedTechnologies = (dynamicTechnologyList || []).filter(
    (tech) => props.data?.technologies?.find((t: any) => t.id === tech.id),
  );

  const [selectedTechnologies, setSelectedTechnologies] = useState<
    Array<SelectSearchItem>
  >(
    (defaultSelectedTechnologies || []).map((technology) => ({
      key: technology.id,
      value: technology.name,
      label: technology.name,
      chipLabel: technology.abbreviation,
    })),
  );

  return (
    <>
      <Card key={props.data.id as string} className="w-full">
        <CardHeader>
          <div className="flex w-full justify-between">
            <div className="text-md font-bold">{props.data.name}</div>

            <div className="flex space-x-1">
              <Tooltip content="Edit" color="success">
                <button
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  onClick={() =>
                    openEditModal(
                      props.data.id,
                      props.data.name,
                      props.data.abbreviation,
                      props.data.technologies,
                    )
                  }
                >
                  <EditIcon />
                </button>
              </Tooltip>
              <Tooltip content="Delete" color="danger">
                <button
                  className="bg-transparent"
                  onClick={() => openModalDelete(props.data.id as string)}
                >
                  <DeleteIcon />
                </button>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="mb-4">
            {props.data.image ? (
              <Image
                width={200}
                height={200}
                alt={`${props.data.name} Image`}
                src={props.data.image}
                className="h-full w-full rounded-md object-contain"
              />
            ) : (
              <Image
                width={200}
                height={200}
                alt="Default Position Image"
                src="/icons/technology/noimg.png"
                className="h-full w-full rounded-md object-contain"
              />
            )}
          </div>
          <div>
            <span className="font-semibold">Abbreviation: </span>
            {props.data.abbreviation}
          </div>
          <div className="mt-2">
            <span className="font-semibold">Technologies:</span>{" "}
            <span className="whitespace-normal">
              {props.data?.technologies
                ?.map((tech: Tech) => tech.name)
                .join(", ")}
            </span>
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onOpenDeleteChange}
        className="max-w-fit"
      >
        <ModalContent>
          <ModalBody className="mt-5">
            Are you sure you want to delete?
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Button
                onClick={() => handleDelete(props.data.id)}
                color="primary"
              >
                Yes
              </Button>
              <Button onClick={onCloseDelete}>No</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={onOpenEditChange}>
        <ModalContent>
          <ModalHeader className="mt-2 flex justify-center">
            Update information
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Full Name"
              label="Full Name"
              value={updateData.name}
              onChange={(e) =>
                setUpdateData({ ...updateData, name: e.target.value })
              }
            />
            <Input
              placeholder="Abbreviation"
              label="Abbreviation"
              className="mt-2"
              value={updateData.abbreviation}
              onChange={(e) =>
                setUpdateData({ ...updateData, abbreviation: e.target.value })
              }
            />

            {/* <Select
              value={technologyId}
              placeholder="Select technology"
              selectionMode="multiple"
              onSelectionChange={(id) =>
                handleSelectTechnology(id as Set<string>)
              }
            >
              {technologyData.map((technology: Tech) => (
                <SelectItem key={technology.id} value={technology.id}>
                  {technology.name}
                </SelectItem>
              ))}
            </Select> */}

            <SelectSearch
              label="Technologies"
              placeholder="Select technologies"
              selectionMode="multiple"
              isLoading={isTechnologiesLoading}
              items={(dynamicTechnologyList || []).map((technology) => ({
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

            <div className="mt-2 grid grid-cols-2 gap-5">
              <Button onClick={handleUpdate} color="primary">
                Update
              </Button>
              <Button onClick={onCloseEdit}>Cancel</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
