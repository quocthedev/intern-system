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
} from "@/app/(dashboard)/internPeriod/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/libs/config";
import { Spinner } from "@nextui-org/spinner";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColorMap: Record<string, ChipProps["color"]> = {
  InProgress: "success",
  Rejected: "danger",
  Pending: "warning",
};

export default function InternPeriodTable() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const internPeriod = await fetch(apiEndpoints.internPeriod).then((res) =>
        res.json(),
      );

      return { period: internPeriod?.data?.pagingData || [] };
    },
  });

  const periodData = data?.period || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(apiEndpoints.internPeriod + "/" + id, { method: "DELETE" }).then(
        (response) => response.json(),
      ),

    onSuccess: () => {
      toast.success("Deleted period successfully!");
      refetch();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to delete period.");
    },
  });

  const handleDeleteConfirmation = (id: string) => {
    setSelectedPeriod(id);
    onOpen();
  };

  const confirmDelete = () => {
    if (selectedPeriod) {
      deleteMutation.mutate(selectedPeriod);
      onClose();
    }
  };

  const columns = [
    { key: "name", label: "FULL NAME" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "description", label: "Description" },
    { key: "internshipDuration", label: "Duration" },
    { key: "numberOfMember", label: "Total Members" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = React.useCallback((period: any, columnKey: React.Key) => {
    const cellValue = period[columnKey as keyof typeof period];

    switch (columnKey) {
      case "name":
        return <div>{period.name}</div>;
      case "startDate":
        return <div>{formatDate(period.startDate)}</div>;
      case "endDate":
        return <div>{formatDate(period.endDate)}</div>;
      case "description":
        return <div>{period.description}</div>;
      case "internshipDuration":
        return <div>{period.internshipDuration}</div>;
      case "numberOfMember":
        return <div>{period.numberOfMember}</div>;
      case "status":
        return (
          <Chip color={statusColorMap[period.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="Edit">
              <span className="cursor-pointer">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                onClick={() => handleDeleteConfirmation(period.id)}
                className="cursor-pointer"
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

  const formatDate = (dob: string) => {
    const date = new Date(dob);

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Table selectionMode="multiple">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={periodData}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner /> Loading...
            </div>
          }
        >
          {(period: any) => (
            <TableRow key={period.id}>
              {(columnKey) => (
                <TableCell>{renderCell(period, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            <p>Are you sure you want to delete this period?</p>
            <div className="mt-4 flex gap-5">
              <Button color="primary" onClick={confirmDelete}>
                Yes
              </Button>
              <Button onClick={onClose}>No</Button>
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
