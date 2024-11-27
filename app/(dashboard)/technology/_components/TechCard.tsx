"use client";
import { API_ENDPOINTS } from "@/libs/config";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  EditIcon,
  DeleteIcon,
} from "@/app/(dashboard)/technology/_components/Icons";
import { Divider } from "@nextui-org/divider";
import Image from "next/image";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import APIClient from "@/libs/api-client";
import { Pagination } from "@nextui-org/pagination";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { Input } from "@nextui-org/input";

export interface TechnologyInterface {
  name: string;
  abbreviation: string;
  imageUri: string;
  description: string;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: Boolean;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export const TechCard = () => {
  const [selectedTech, setSelectedTech] = useState("");
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

  const [updateData, setUpdateData] = useState({
    name: "",
    abbreviation: "",
    description: "",
    imageUri: "",
  });

  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 6;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["technology", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<TechnologyInterface>
      >(API_ENDPOINTS.technology, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<TechnologyInterface>;

        return {
          technologies: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });

  console.log(data);

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.technology + "/" + id, {
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
      await fetch(API_ENDPOINTS.technology + "/" + selectedTech, {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    toast.success("Deleted successfully!");
    onCloseDelete();
  };

  const openModalDelete = (id: string) => {
    onOpenDelete();
    setSelectedTech(String(id));
  };

  const openEditModal = (
    id: React.SetStateAction<string>,
    name: string,
    abbreviation: string,
    description: string,
    imageUri: string,
  ) => {
    setSelectedTech(id);
    setUpdateData({ name, abbreviation, description, imageUri });
    onOpenEdit();
  };

  const handleUpdate = async () => {
    updateMutation.mutate();

    if (!selectedFile) return;

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_ENDPOINTS.technology}/${selectedTech}/upload-technology-image`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      await refetch();
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="mt-20 flex items-center justify-center gap-3">
          <Spinner size="lg" />
          Loading...
        </div>
      ) : (
        <div>
          <div className="grid h-full grid-cols-3 gap-5">
            {data?.technologies &&
              data.technologies.map((technology: TechnologyInterface) => (
                <Card key={technology.id as string} className="w-full">
                  <CardHeader>
                    <div className="flex w-full justify-between">
                      <div className="text-md font-bold">{technology.name}</div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() =>
                            openEditModal(
                              technology.id,
                              technology.name,
                              technology.abbreviation,
                              technology.description,
                              technology.imageUri,
                            )
                          }
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="bg-transparent"
                          onClick={() =>
                            openModalDelete(technology.id as string)
                          }
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {technology.imageUri ? (
                      <Image
                        width={200}
                        height={200}
                        alt={`${technology.name} Image`}
                        src={technology.imageUri}
                        className="grounded-md h-40 w-full object-contain"
                      />
                    ) : (
                      <Image
                        width={200}
                        height={200}
                        alt="Default University Image"
                        src="/icons/technology/noimg.png"
                        className="grounded-md h-40 w-full object-contain"
                      />
                    )}
                    <div className="mb-2 mt-2">
                      <span className="font-semibold">Abbreviation: </span>
                      {technology.abbreviation}
                    </div>
                    <div className="mb-2 mt-1">
                      <span className="font-semibold">Description: </span>
                      {technology.description}
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
                    onClick={() => handleDelete(selectedTech)}
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
                  placeholder="Name"
                  label="Name"
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
                    setUpdateData({
                      ...updateData,
                      abbreviation: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="Description"
                  label="Description"
                  className="mt-2"
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                />

                <div className="mb-4">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    Change Image
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".png, .jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Selected file: </span>
                      {selectedFile.name}
                    </p>
                  )}
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
        </div>
      )}
    </div>
  );
};
