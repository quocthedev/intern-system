"use client";

import React, { useState } from "react";
import {
  DeleteIcon,
  EditIcon,
} from "@/app/(dashboard)/university/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { useMutation } from "@tanstack/react-query"; //get request
import { API_ENDPOINTS } from "@/libs/config";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Pagination } from "@nextui-org/pagination";
import Image from "next/image";
import { useUniversity } from "@/data-store/university";
import { useUniversityContext } from "@/app/(dashboard)/university/_providers/UniversityProvider";
import { Spinner } from "@nextui-org/spinner";

interface UniversityInterface {
  id: string;
  name: string;
  abbreviation: string;
  address: string;
  image: string;
}

export default function UniversityTable() {
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

  const [selectedUni, setSelectedUni] = useState("");
  const [updateData, setUpdateData] = useState({
    name: "",
    abbreviation: "",
    address: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const { isLoading, error, data, refetch } = useUniversity({ pageSize });
  const {
    isListUniversityLoading,
    listUniversityData,
    refetchListUniversity,
    setUniversityPageIndex,
  } = useUniversityContext();

  const data = listUniversityData?.universities;

  const mutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.university + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json()),

    onError: (error) => {
      toast.error(error.message);
    },

    onSuccess: () => {
      refetchListUniversity();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch(API_ENDPOINTS.university + "/" + selectedUni, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      refetchListUniversity();
      onCloseEdit();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDelete = (id: string) => {
    mutation.mutate(id);
    toast.success("Deleted university successfully!");
    onCloseDelete();
  };

  const openModalDelete = (id: string) => {
    onOpenDelete();
    setSelectedUni(String(id));
  };

  const openEditModal = (
    id: React.SetStateAction<string>,
    name: string,
    abbreviation: string,
    address: string,
  ) => {
    setSelectedUni(id);
    setUpdateData({ name, abbreviation, address });
    onOpenEdit();
  };

  const handleUpdate = async () => {
    updateMutation.mutate();

    if (!selectedFile) return;

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_ENDPOINTS.university}/${selectedUni}/upload-university-image`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      await refetchListUniversity();
    } catch (error) {
      toast.error("Error uploading image");
      console.error(error);
    }
  };

  return (
    <div>
      {isListUniversityLoading ? (
        <Spinner className="flex items-center gap-4">Loading...</Spinner>
      ) : (
        <div className="grid h-full grid-cols-3 gap-5">
          {data &&
            data.map((university: UniversityInterface) => (
              <Card key={university.id as string} className="w-full">
                <CardHeader>
                  <div className="flex w-full justify-between">
                    <div className="text-md font-bold">{university.name}</div>

                    <div className="flex space-x-1">
                      <Tooltip content="Edit" color="success">
                        <button
                          className="cursor-pointer text-lg text-default-400 active:opacity-50"
                          onClick={() =>
                            openEditModal(
                              university.id,
                              university.name,
                              university.abbreviation,
                              university.address,
                            )
                          }
                        >
                          <EditIcon />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete" color="danger">
                        <button
                          className="bg-transparent"
                          onClick={() =>
                            openModalDelete(university.id as string)
                          }
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
                    {university.image ? (
                      <Image
                        width={1000}
                        height={1000}
                        alt={`${university.name} Image`}
                        src={university.image}
                        className="h-full w-full rounded-md object-contain"
                      />
                    ) : (
                      <Image
                        width={200}
                        height={200}
                        layout="responsive"
                        alt="Default University Image"
                        src="/icons/technology/noimg.png"
                        className="rounded-md object-contain"
                      />
                    )}
                  </div>

                  <div>
                    <span className="font-bold">Abberviation: </span>
                    {university.abbreviation}
                  </div>
                  <div className="mt-2">
                    <span className="font-bold">Address: </span>
                    {university.address}
                  </div>
                </CardBody>
              </Card>
            ))}
        </div>
      )}

      {listUniversityData?.totalPages ? (
        <Pagination
          className="m-4 flex justify-center"
          isCompact
          loop
          showControls
          total={listUniversityData?.totalPages as number}
          initialPage={listUniversityData.pageIndex}
          onChange={(page) => {
            setUniversityPageIndex(page);
          }}
        />
      ) : (
        <></>
      )}

      <Modal
        isOpen={isDeleteOpen}
        onOpenChange={onOpenDeleteChange}
        className="max-w-fit"
      >
        <ModalContent>
          <ModalBody className="mt-5">
            Are you sure you want to delete?
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Button onClick={() => handleDelete(selectedUni)} color="primary">
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
            <Input
              placeholder="Address"
              label="Address"
              className="mt-2"
              value={updateData.address}
              onChange={(e) =>
                setUpdateData({ ...updateData, address: e.target.value })
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
                accept=".png"
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
  );
}
