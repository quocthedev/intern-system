"use client";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import { Tooltip } from "@nextui-org/tooltip";
import { DeleteIcon, ViewIcon } from "../../../_components/Icons";
import { useUniversityCandidateContext } from "../_providers/UniversityCandidateProvider";
import ActionBar from "./ActionBar";
import { Pagination } from "@nextui-org/pagination";
import { Link } from "@nextui-org/link";
import { Chip, ChipProps } from "@nextui-org/chip";
import { getCookie } from "@/app/util";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { EllipsisIcon } from "@/app/(dashboard)/internPeriod/_components/Icons";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Approved: "success",
  InProgress: "warning",
  Rejected: "danger",
  InterviewEmailSent: "warning",
  InterviewResultEmailSent: "warning",
  CompletedOjt: "success",
};

const role = getCookie("userRole");

export default function UniversityCandidateCard() {
  const { isLoading, data, setPageIndex, refetch } =
    useUniversityCandidateContext();

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  const [selectedCandidate, setSelectedCandidate] = useState("");

  const deleteInternMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`${API_ENDPOINTS.candidate}/${id}`, { method: "DELETE" }).then(
        (response) => response.json(),
      ),
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess: () => {
      refetch();
      toast.success("Delete success");
    },
  });

  const handleDelete = (id: string) => {
    deleteInternMutation.mutate(id);
    onCloseDelete();
  };

  const openDeleteModal = (id: string) => {
    onOpenDelete();
    setSelectedCandidate(id);
  };

  const columnCandidate = [
    {
      key: "studentCode",
      label: "Student Code",
    },
    {
      key: "fullName",
      label: "Full Name",
    },

    {
      key: "personalEmail",
      label: "Email",
    },
    {
      key: "universityEmail",
      label: "University Email",
    },
    {
      key: "cvUri",
      label: "CV",
    },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const renderCellCandidate = (candidate: any, columnKey: React.Key) => {
    const cellValue = candidate[columnKey as keyof typeof candidate];

    switch (columnKey) {
      case "studentCode":
        return <div>{candidate.studentCode}</div>;
      case "fullName":
        return <div>{candidate.fullName}</div>;
      case "doB":
        return <div>{candidate.doB}</div>;
      case "phoneNumber":
        return <div>{candidate.phoneNumber}</div>;
      case "personalEmail":
        return <div>{candidate.personalEmail}</div>;
      case "universityEmail":
        return <div>{candidate.universityEmail}</div>;
      case "gender":
        return <div>{candidate.gender}</div>;
      case "cvUri":
        return (
          <Link
            href={`
          /intern/details/${candidate.id}/cv
          `}
          >
            Link
          </Link>
        );
      case "status":
        return (
          <Chip
            className="text-xs capitalize"
            color={statusColorMap[candidate.status]}
            size="sm"
            variant="flat"
          >
            {typeof cellValue === "object"
              ? JSON.stringify(cellValue)
              : cellValue}
          </Chip>
        );
      case "action":
        return (
          <div className="flex gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <EllipsisIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem key="view" className="flex items-center">
                  <Link
                    href={`/intern/details/${candidate.id}`}
                    className="w-full text-medium text-black"
                  >
                    <button className="cursor-pointer">
                      <span className="flex items-center">
                        <ViewIcon className="mr-2" /> View detail
                      </span>
                    </button>
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  {role === "Administrator" ||
                  role === "HR Manager" ||
                  role === "University Offical" ? (
                    <button
                      onClick={() => openDeleteModal(candidate.id)}
                      className="-mt-1 flex w-full cursor-pointer items-center text-medium"
                    >
                      <DeleteIcon className="mr-2" /> Delete
                    </button>
                  ) : (
                    <></>
                  )}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <ActionBar />

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner /> Loading...
        </div>
      ) : (
        <Table fullWidth>
          <TableHeader columns={columnCandidate}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={data?.candidates || []}
            loadingState={isLoading ? "loading" : "idle"}
            loadingContent={
              <div className="flex items-center gap-2">
                <Spinner /> Loading...
              </div>
            }
          >
            {(candidate) => (
              <TableRow key={candidate.id}>
                {(colKey) => (
                  <TableCell>
                    {renderCellCandidate(candidate, colKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <Pagination
        isCompact
        loop
        showControls
        total={Number(data?.totalPages) || 1}
        initialPage={1}
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
                onClick={() => handleDelete(selectedCandidate)}
                color="primary"
              >
                Yes
              </Button>
              <Button onClick={onCloseDelete}>No</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
