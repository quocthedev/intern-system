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
  ViewIcon,
} from "@/app/(dashboard)/internPeriod/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { Spinner } from "@nextui-org/spinner";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import Link from "next/link";
import { useInternPeriodContext } from "../_providers/InternPeriodProvider";
import { Pagination } from "@nextui-org/pagination";

const statusColorMap: Record<string, ChipProps["color"]> = {
  InProgress: "warning",
  Rejected: "danger",
  Pending: "warning",
};

export default function InternPeriodTable() {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    isListInternPeriodLoading,
    listInternPeriodData,
    refetchListInternPeriod,
    setInternPeriodPageId,
  } = useInternPeriodContext();

  const periodData = listInternPeriodData?.periods || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.internPeriod + "/" + id, { method: "DELETE" }).then(
        (response) => response.json(),
      ),

    onSuccess: () => {
      toast.success("Deleted period successfully!");
      refetchListInternPeriod();
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
    { key: "no", label: "NO" },
    { key: "name", label: "NAME" },
    { key: "startDate", label: "START DATE" },
    { key: "endDate", label: "END DATE" },
    { key: "internshipDuration", label: "DURATION " },
    { key: "numberOfMember", label: "MAX MEMBER" },
    { key: "currentUniversityQuantity", label: "CURRENT UNIVERSITY" },
    { key: "currentCandidateQuantity", label: "CURRENT CANDIDATE" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = React.useCallback(
    (period: any, columnKey: React.Key, index: number) => {
      const cellValue = period[columnKey as keyof typeof period];

      switch (columnKey) {
        case "no":
          return <div className="text-center text-xs">{index + 1}</div>;
        case "name":
          return <div className="text-xs">{period.name}</div>;
        case "startDate":
          return <div className="text-xs">{formatDate(period.startDate)}</div>;
        case "endDate":
          return <div className="text-xs">{formatDate(period.endDate)}</div>;

        case "internshipDuration":
          return (
            <div className="text-xs">
              {`${period.internshipDuration} `}
              {period.internshipDuration === 1 ? "month" : "months"}
            </div>
          );
        case "numberOfMember":
          return (
            <div className="text-center text-xs">
              {period.maxCandidateQuantity}{" "}
            </div>
          );
        case "currentUniversityQuantity":
          return (
            <div className="text-center text-xs">
              {period.currentUniversityQuantity}
            </div>
          );
        case "currentCandidateQuantity":
          return (
            <div className="text-center text-xs">
              {period.currentCandidateQuantity}{" "}
            </div>
          );
        case "description":
          return (
            <div className="text-center text-xs">{period.description}</div>
          );
        case "status":
          return (
            <Chip
              color={statusColorMap[period.status]}
              size="sm"
              variant="flat"
            >
              {cellValue.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </Chip>
          );
        case "actions":
          return (
            <div className="flex gap-2">
              <Tooltip content="View detail">
                <Link href={`/internPeriod/${period.id}`}>
                  <button className="cursor-pointer">
                    <ViewIcon />
                  </button>
                </Link>
              </Tooltip>

              <Tooltip content="Delete">
                <button
                  onClick={() => handleDeleteConfirmation(period.id)}
                  className="-mt-1 cursor-pointer"
                  hidden={period.currentCandidateQuantity > 0}
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

  const formatDate = (dob: string) => {
    const date = new Date(dob);

    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={periodData}
          loadingState={isListInternPeriodLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner /> Loading...
            </div>
          }
        >
          {periodData.map((period: any, index: number) => (
            <TableRow key={period.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {renderCell(period, column.key, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        isCompact
        loop
        showControls
        total={Number(listInternPeriodData?.totalPages) || 1}
        initialPage={1}
        onChange={(page) => {
          setInternPeriodPageId(page);
        }}
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          <ModalBody className="mt-4 text-center">
            <p>Are you sure you want to delete this period?</p>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Button color="primary" onClick={confirmDelete}>
                Yes
              </Button>
              <Button onClick={onClose} color="default">
                No
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
