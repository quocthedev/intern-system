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
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { Avatar } from "@nextui-org/react";
import Loading from "@/components/Loading";

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
    { key: "no", label: "NO" },
    { key: "avatar", label: "AVATAR" },
    {
      key: "studentCode",
      label: "Student Code",
    },
    {
      key: "fullName",
      label: "Full Name",
    },
    // {
    //   key: "personalEmail",
    //   label: "Email",
    // },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "universityEmail",
      label: "University Email",
    },
    { key: "phoneNumber", label: "Phone Number" },
    {
      key: "cvUri",
      label: "CV",
    },
    { key: "desiredPosition", label: "Desired Position" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const renderCellCandidate = (
    candidate: any,
    columnKey: React.Key,
    index: number,
  ) => {
    const cellValue = candidate[columnKey as keyof typeof candidate];

    switch (columnKey) {
      case "no":
        return <div>{index + 1}</div>;
      case "avatar":
        return (
          <div>
            {candidate.avatar ? (
              <Avatar
                alt={`${candidate.fullName} Image`}
                src={candidate.avatar}
                className="h-12 w-12"
              />
            ) : (
              <Avatar
                className="h-12 w-12"
                alt="Default Candidate Image"
                src="/icons/technology/no-avatar.png"
              />
            )}
          </div>
        );
      case "studentCode":
        return <div className="text-xs">{candidate.studentCode}</div>;
      case "fullName":
        return <div className="text-xs">{candidate.fullName}</div>;
      case "doB":
        return <div className="text-xs">{candidate.doB}</div>;
      case "phoneNumber":
        return <div className="text-xs">{candidate.phoneNumber}</div>;
      case "personalEmail":
        return <div className="text-xs">{candidate.personalEmail}</div>;
      case "universityEmail":
        return <div className="text-xs">{candidate.universityEmail}</div>;
      case "gender":
        return <div className="text-xs">{candidate.gender}</div>;
      case "cvUri":
        return (
          <Link
            href={`
          /intern/details/${candidate.id}/cv
          
          `}
            className="text-xs"
          >
            Link
          </Link>
        );
      case "desiredPosition":
        return <div className="text-xs">{candidate.desiredPosition}</div>;
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
          <div className="flex">
            <Tooltip content="View detail">
              <Link
                href={`/internPeriod/details/${candidate.id}`}
                className="w-full text-medium text-black"
              >
                <button className="mb-1 cursor-pointer">
                  <ViewIcon className="mr-3" />
                </button>
              </Link>
            </Tooltip>

            <Tooltip content="Delete">
              <button
                onClick={() => openDeleteModal(candidate.id)}
                className="-ml-1 -mt-1 flex w-full cursor-pointer items-center text-medium"
              >
                <DeleteIcon />
              </button>
            </Tooltip>
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
            loadingContent={<Loading />}
          >
            {(candidate) => (
              <TableRow key={candidate.id}>
                {(colKey) => (
                  <TableCell>
                    {renderCellCandidate(
                      candidate,
                      colKey,
                      data?.candidates?.indexOf(candidate || 0) as number,
                    )}
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
            Are you sure you want to delete this candidate?
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
