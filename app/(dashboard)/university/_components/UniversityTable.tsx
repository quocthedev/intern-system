"use client";

import React, { useState } from "react";
import {
  DeleteIcon,
  EditIcon,
} from "@/app/(dashboard)/university/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query"; //get request
import { API_ENDPOINTS } from "@/libs/config";
import { Spinner } from "@nextui-org/spinner";
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
import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Pagination } from "@nextui-org/pagination";
import Image from "next/image";
const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

interface UniversityInterface {
  id: string;
  name: string;
  abbreviation: string;
  address: string;
  imageUri: string;
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

  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 6;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["university", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<UniversityInterface>
      >(API_ENDPOINTS.university, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<UniversityInterface>;

        return {
          universitites: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });
  const mutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.university + "/" + id, {
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
      await fetch(API_ENDPOINTS.university + "/" + selectedUni, {
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

  const handleUpdate = () => {
    updateMutation.mutate();
  };

  const columns = [
    {
      key: "image",
      label: "IMAGE",
    },
    {
      key: "name",
      label: "NAME",
    },

    {
      key: "abbreviation",
      label: "ABBREVIATION",
    },
    {
      key: "address",
      label: "ADDRESS",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  // const renderCell = React.useCallback((univer: any, columnKey: React.Key) => {
  //   const cellValue = univer[columnKey as keyof typeof univer];

  //   switch (columnKey) {
  //     case "name":
  //       return <div className="text-xs">{univer.name}</div>;
  //     case "abbreviation":
  //       return <div className="text-xs">{univer.abbreviation}</div>;
  //     case "address":
  //       return <div className="text-xs">{univer.address}</div>;

  //     case "actions":
  //       return (
  //         <div className="relative flex items-center gap-2">
  //           <Tooltip content="Edit ">
  //             <button
  //               className="cursor-pointer text-lg text-default-400 active:opacity-50"
  //               onClick={() =>
  //                 openEditModal(
  //                   univer.id,
  //                   univer.name,
  //                   univer.abbreviation,
  //                   univer.address,
  //                 )
  //               }
  //             >
  //               <EditIcon />
  //             </button>
  //           </Tooltip>
  //           <Tooltip color="danger" content="Delete">
  //             <button
  //               className="cursor-pointer text-lg text-danger active:opacity-50"
  //               onClick={() => openModalDelete(univer.id)}
  //             >
  //               <DeleteIcon />
  //             </button>
  //           </Tooltip>
  //         </div>
  //       );
  //     default:
  //       return cellValue;
  //   }
  // }, []);

  if (error) {
    return <div>Error + {error.message}</div>;
  }

  return (
    <div>
      <div className="grid h-full grid-cols-3 gap-5">
        {data?.universitites &&
          data.universitites.map((university: UniversityInterface) => (
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
                        onClick={() => openModalDelete(university.id as string)}
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
                  {university.imageUri ? (
                    <Image
                      width={200}
                      height={200}
                      alt={`${university.name} Image`}
                      src={university.imageUri}
                      className="rounded-md"
                    />
                  ) : (
                    <Image
                      width={200}
                      height={200}
                      layout="responsive"
                      alt="Default University Image"
                      src="/icons/technology/school.png"
                      className="rounded-md object-cover"
                    />
                  )}
                </div>

                <div>
                  <span className="font-bold">Abberviation: </span>
                  {university.abbreviation}
                </div>
                <div className="text-xs">
                  <span className="font-bold">Adress: </span>
                  {university.address}
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
              <Button onClick={() => handleDelete(selectedUni)} color="primary">
                Yes
              </Button>
              <Button onClick={onCloseDelete}>No</Button>
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
