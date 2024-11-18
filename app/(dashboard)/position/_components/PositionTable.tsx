"use client";

import React, { useState } from "react";
import {
  DeleteIcon,
  EditIcon,
} from "@/app/(dashboard)/position/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query"; //get request
import { API_ENDPOINTS } from "@/libs/config";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import APIClient from "@/libs/api-client";
import { Pagination } from "@nextui-org/pagination";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import AddTechModal from "@/app/(dashboard)/position/_components/AddTechModal";
import Image from "next/image";

interface Tech {
  id: string;
  name: string;
}

interface PositionInterface {
  id: string;
  name: string;
  abbreviation: string;
  tenologies: any;
  image: string;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export default function PositionTable() {
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
    onOpenChange: onOpenEditChange,
  } = useDisclosure();

  const [selectedPosition, setSelectedPosition] = useState("");
  const [updateData, setUpdateData] = useState({
    name: "",
    abbreviation: "",
  });

  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 6;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["position", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<PositionInterface>
      >(API_ENDPOINTS.position, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<PositionInterface>;

        return {
          positions: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
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
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch(API_ENDPOINTS.position + "/" + selectedPosition, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      refetch();
      onCloseEdit();
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
    toast.success("Deleted successfully!");
    onCloseDelete();
  };

  const openModalDelete = (id: string) => {
    onOpenDelete();
    setSelectedPosition(String(id));
  };

  const openEditModal = (
    id: React.SetStateAction<string>,
    name: string,
    abbreviation: string,
  ) => {
    setSelectedPosition(id);
    setUpdateData({ name, abbreviation });
    onOpenEdit();
  };

  const handleUpdate = () => {
    updateMutation.mutate();
  };

  if (error) {
    return <div>Error + {error.message}</div>;
  }

  return (
    <div>
      <div className="grid h-full grid-cols-3 gap-5">
        {data?.positions &&
          data.positions.map((position: PositionInterface) => (
            <Card key={position.id as string} className="w-full">
              <CardHeader>
                <div className="flex w-full justify-between">
                  <div className="text-md font-bold">{position.name}</div>

                  <div className="flex space-x-1">
                    <Tooltip content="Edit" color="success">
                      <button
                        className="cursor-pointer text-lg text-default-400 active:opacity-50"
                        onClick={() =>
                          openEditModal(
                            position.id,
                            position.name,
                            position.abbreviation,
                          )
                        }
                      >
                        <EditIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete" color="danger">
                      <button
                        className="bg-transparent"
                        onClick={() => openModalDelete(position.id as string)}
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
                  {position.image ? (
                    <Image
                      width={200}
                      height={200}
                      alt={`${position.name} Image`}
                      src={position.image}
                      className="grounded-md h-40 w-full object-cover"
                    />
                  ) : (
                    <Image
                      width={200}
                      height={200}
                      alt="Default University Image"
                      src="/icons/technology/devops.png"
                      className="grounded-md h-40 w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="font-semibold">Abbreviation:</span>
                  {position.abbreviation}
                </div>
                <div className="mt-2 text-xs">
                  <span className="font-semibold">Technologies:</span>{" "}
                  <span className="whitespace-normal">
                    {position?.tenologies
                      ?.map((tech: Tech) => tech.name)
                      .join(", ")}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
      </div>
      <Pagination
        className="m-4 flex justify-center"
        isCompact
        loop
        showControls
        total={data?.totalPages ? Number(data.totalPages) : 0}
        initialPage={pageIndex}
        onChange={(page) => {
          setPageIndex(page);
        }}
      />

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
                onClick={() => handleDelete(selectedPosition)}
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

            <div className="grid grid-cols-2 gap-5">
              <AddTechModal selectedPositionId={selectedPosition} />
              <Button color="danger">Remove tech</Button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-5">
              <Button onClick={handleUpdate} color="primary">
                Update
              </Button>
              <Button onClick={onCloseEdit}>Cancel</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </div>
  );
}
