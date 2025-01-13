import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import NewPrositionModal from "./NewPositionModal";
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
import { usePositionContext } from "@/app/(dashboard)/position/_providers/PositionProvider";
import { getCookie } from "cookies-next";

export default function ActionBar() {
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
  const accessToken = getCookie("accessToken");

  interface PositionInterface {
    name: string;
    abbreviation: string;
    technologies: string[];
    id: string;
    dateCreate: string;
    dateUpdate: string;
    isDeleted: boolean;
  }

  const { listPositionData } = usePositionContext();

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

  const positionData = listPositionData?.positions || [];
  const technologyData = data?.technologies || [];

  const mutation = useMutation({
    mutationFn: async (techIds: string[]) => {
      const response = await fetch(
        `${API_ENDPOINTS.position}/${positionId}/technologies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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

  // const handleRemoveTech = () => {
  //   removeMutation.mutate(technologyId);
  // };
  const { setSearch } = usePositionContext();

  return (
    <div>
      <div className="flex w-full gap-2">
        <Input
          size="md"
          placeholder="Search by position name"
          className="flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />
        <NewPrositionModal />

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
                  value={positionId}
                  placeholder="Select a position"
                  onSelectionChange={(id) =>
                    handleSelectPosition(Array.from(id).toString())
                  }
                  className="mb-6"
                >
                  {positionData.map((position: PositionInterface) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  ))}
                </Select>
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

        <Modal
          isOpen={isRemoveTechOpen}
          onOpenChange={onOpenRemoveTechChange}
          className="max-w-lg"
        >
          <ModalContent>
            <ModalBody className="mt-5">
              <span className="text-center text-xl font-semibold">
                Remove technologies
              </span>
              <div className="gap-4">
                <Select
                  value={positionId}
                  placeholder="Select a position"
                  onSelectionChange={(id) =>
                    handleSelectPosition(Array.from(id).toString())
                  }
                  className="mb-6"
                >
                  {positionData.map((position: PositionInterface) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  ))}
                </Select>
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
                <Button color="primary">Yes</Button>
                <Button onClick={onCloseRemoveTech}>No</Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
