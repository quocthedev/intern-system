"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Chip, ChipProps } from "@nextui-org/chip";
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

const statusColorMap: Record<string, ChipProps["color"]> = {
  InProgress: "success",
  Rejected: "danger",
  Pending: "warning",
};

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

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const university = await fetch(API_ENDPOINTS.university).then((res) =>
        res.json(),
      );

      return { universitys: university?.data?.pagingData || [] };
    },
  });

  const universityData = data?.universitys || [];

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
      key: "name",
      label: "FULL NAME",
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

  const renderCell = React.useCallback((univer: any, columnKey: React.Key) => {
    const cellValue = univer[columnKey as keyof typeof univer];

    switch (columnKey) {
      case "name":
        return <div>{univer.name}</div>;
      case "description":
        return <div>{univer.description}</div>;
      case "internshipDuration":
        return <div>{univer.internshipDuration}</div>;
      case "numberOfMember":
        return <div>{univer.numberOfMember}</div>;
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[univer.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit ">
              <button
                className="cursor-pointer text-lg text-default-400 active:opacity-50"
                onClick={() =>
                  openEditModal(
                    univer.id,
                    univer.name,
                    univer.abbreviation,
                    univer.address,
                  )
                }
              >
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip color="danger" content="Delete">
              <button
                className="cursor-pointer text-lg text-danger active:opacity-50"
                onClick={() => openModalDelete(univer.id)}
              >
                <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (error) {
    return <div>Error + {error.message}</div>;
  }

  return (
    <>
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={universityData}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner />
              Loading...
            </div>
          }
          emptyContent={<div>No university found!</div>}
        >
          {(uni: any) => (
            <TableRow key={uni.id}>
              {(columnKey) => (
                <TableCell>{renderCell(uni, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </>
  );
}
