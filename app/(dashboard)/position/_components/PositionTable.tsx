"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import React, { useState } from "react";
import {
  DeleteIcon,
  EditIcon,
} from "@/app/(dashboard)/position/_components/Icons";
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

interface Tech {
  id: string;
  name: string;
}

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

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const position = await fetch(API_ENDPOINTS.position).then((res) =>
        res.json(),
      );

      return { positions: position?.data?.pagingData || [] };
    },
  });

  const positionData = data?.positions || [];

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

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "abbreviation",
      label: "ABBREVIATION",
    },
    {
      key: "technologies",
      label: "TECHNOLOGIES",
    },

    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = React.useCallback(
    (position: any, columnKey: React.Key) => {
      const cellValue = position[columnKey as keyof typeof position];

      switch (columnKey) {
        case "name":
          return <div>{position.name}</div>;
        case "abbreviation":
          return <div>{position.abbreviation}</div>;
        case "technologies":
          return (
            <div className="flex gap-2">
              {position?.tenologies?.map((tech: Tech) => (
                <div key={tech.id}>{tech.name}</div>
              ))}
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit ">
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
              <Tooltip color="danger" content="Delete">
                <button
                  className="cursor-pointer text-lg text-danger active:opacity-50"
                  onClick={() => openModalDelete(position.id)}
                >
                  <DeleteIcon />
                </button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  if (error) {
    return <div>Error + {error.message}</div>;
  }

  return (
    <>
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={
                column.key === "technologies"
                  ? "w-1/2" // Make this column take up more width
                  : column.key === "name"
                    ? "w-1/3" // Make this column smaller
                    : "w-1/7" // Default width for other columns
              }
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={positionData}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner />
              Loading...
            </div>
          }
          emptyContent={<div>No position found!</div>}
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
    </>
  );
}
