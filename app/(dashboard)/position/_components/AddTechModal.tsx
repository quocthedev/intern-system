"use client";

import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import { AddIcon } from "./Icons";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { API_ENDPOINTS } from "@/libs/config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectItem } from "@nextui-org/select";
import { toast } from "sonner";

interface SelectedPostionIdProps {
  selectedPositionId: string;
}

export default function AddTechModal({
  selectedPositionId,
}: SelectedPostionIdProps) {
  const {
    isOpen: isAddTechOpen,
    onOpen: onOpenAddTech,
    onClose: onCloseAddTech,
    onOpenChange: onOpenAddTechChange,
  } = useDisclosure();

  const {
    isOpen: isRemoveTechOpen,
    onOpen: onOpenRemoveTech,
    onClose: onCloseRemoveTech,
    onOpenChange: onOpenRemoveTechChange,
  } = useDisclosure();

  const [positionId, setPositionId] = useState("");
  const [technologyId, setTechnologyId] = useState<string[]>([]);
  const queryClient = useQueryClient();
  console.log(selectedPositionId);

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.technology);

      const technology = await response.json();

      return {
        technologies: technology?.data?.pagingData || [],
      };
    },
  });

  const technologyData = data?.technologies || [];

  const mutation = useMutation({
    mutationFn: async (techIds: string[]) => {
      const response = await fetch(
        `${API_ENDPOINTS.position}/${selectedPositionId}/technologies`,
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
      toast.success("New technology added successfully!");
      queryClient.invalidateQueries();
      onCloseAddTech();
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.position}/${positionId}/technology/${technologyId}`,
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
      toast.success("Technology removed successfully!");
      queryClient.invalidateQueries();
      onCloseRemoveTech();
    },
  });

  const handleSelectPosition = (id: string) => {
    setPositionId(id);
  };

  const handleSelectTechnology = (id: Set<string>) => {
    setTechnologyId(Array.from(id)); // Convert Set to array and update state
  };

  const handleAddTech = () => {
    mutation.mutate(technologyId);
  };

  return (
    <div>
      <Button
        color="primary"
        startContent={<AddIcon />}
        variant="shadow"
        onClick={onOpenAddTech}
      >
        Add tech
      </Button>
      <Modal
        isOpen={isAddTechOpen}
        onOpenChange={onOpenAddTechChange}
        className="max-w-lg"
      >
        <ModalContent>
          <ModalBody className="mt-5">
            <span className="text-center text-xl font-semibold">
              Add technologies
            </span>
            <div>
              <Select
                value={technologyId}
                placeholder="Select technology"
                selectionMode="multiple"
                onSelectionChange={(id) =>
                  handleSelectTechnology(id as Set<string>)
                }
              >
                {technologyData.map((technology: any) => (
                  <SelectItem key={technology.id} value={technology.id}>
                    {technology.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-5">
              <Button onClick={handleAddTech} color="primary">
                Add technology
              </Button>
              <Button onClick={onCloseAddTech}>Cancel</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
