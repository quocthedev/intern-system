"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Selection,
} from "@nextui-org/table";
import { Chip, ChipProps } from "@nextui-org/chip";
import React, { Key, useMemo, useState } from "react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
} from "@/app/(dashboard)/intern/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { Pagination } from "@nextui-org/pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
import APIClient from "@/libs/api-client";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Image } from "@nextui-org/image";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Approved: "success",
  Rejected: "danger",
  Pending: "warning",
};

export type AccountTableProps = {
  setSelectedInterns: (
    selectedInterns: Set<{
      id: string;
      fullName: string;
    }>,
  ) => void;
};

type Candidate = {
  id: string;
  avatar: string;
  fullName: string;
  internPeriodViewModel: { name: string };
  // doB: string;
  phoneNumber: string;
  personalEmail: string;
  cvUri: string;
  // gpa: number;
  universityViewModel: { name: string };
  status: string;
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export default function InternsTable({
  setSelectedInterns,
}: AccountTableProps) {
  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 5;

  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  const [selectedCandidate, setSelectedCandidate] = useState("");

  const {
    data: candidateData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["candidates", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<PaginationResponse<Candidate>>(
        API_ENDPOINTS.candidate,
        {
          params: new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: pageSize.toString(),
          }),
        },
      );

      if (response?.statusCode === "200") {
        const { data } = response as PaginationResponseSuccess<Candidate>;

        return {
          candidates: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });

  const candidates = candidateData?.candidates || [];

  const deleteInternMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`${API_ENDPOINTS.candidate}/${id}`, { method: "DELETE" }).then(
        (response) => response.json(),
      ),
    onError: (error) => console.error("Error:", error),
    onSuccess: () => refetch(),
  });

  const handleDelete = (id: string) => {
    deleteInternMutation.mutate(id);
    toast.success("Deleted successfully");
    onCloseDelete();
  };

  const openDeleteModal = (id: string) => {
    onOpenDelete();
    setSelectedCandidate(id);
  };

  const columns = useMemo(
    () => [
      { key: "no", label: "NO" },
      { key: "avatar", label: "AVATAR" },
      { key: "fullName", label: "FULL NAME" },
      { key: "group", label: "GROUP" },
      { key: "phoneNumber", label: "PHONE" },
      { key: "personalEmail", label: "EMAIL" },
      { key: "cvUri", label: "CV" },
      { key: "universityId", label: "UNIVERSITY" },
      { key: "status", label: "STATUS" },
      { key: "actions", label: "ACTIONS" },
    ],
    [],
  );

  const renderCell = (candidate: Candidate, columnKey: Key, index: number) => {
    const cellValue = candidate[columnKey as keyof Candidate];

    switch (columnKey) {
      case "no":
        return <div>{index + 1}</div>;
      case "avatar":
        return (
          <div>
            <Image
              width={50}
              alt="NextUI hero Image"
              src={`https://i.${candidate.avatar.slice(8)}.jpeg`}
            />
          </div>
        );
      case "fullName":
        return <p className="text-xs">{candidate.fullName}</p>;
      case "group":
        return (
          <p className="text-xs">{candidate.internPeriodViewModel.name}</p>
        );
      case "phoneNumber":
        return <p className="text-xs">{candidate.phoneNumber}</p>;
      case "personalEmail":
        return <p className="text-xs">{candidate.personalEmail}</p>;
      case "cvUri":
        return (
          <Link
            className="text-xs text-blue-500 underline"
            href={candidate.cvUri}
          >
            Link
          </Link>
        );
      case "universityId":
        return <p className="text-xs">{candidate.universityViewModel.name}</p>;
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
      case "actions":
        return (
          <div className="flex gap-2">
            <Tooltip content="View detail">
              <Link href={`intern/details/${candidate.id}`}>
                <button className="cursor-pointer">
                  <ViewIcon />
                </button>
              </Link>
            </Tooltip>
            <Tooltip content="Edit">
              <span className="cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete">
              <button
                onClick={() => openDeleteModal(candidate.id)}
                className="cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <Table
        selectionMode="multiple"
        className="w-full"
        onSelectionChange={(keys: Selection) => {
          // add selected interns name
          setSelectedInterns(
            new Set(
              Array.from(keys as Set<string>).map((key) => {
                const intern = candidates.find((c) => c.id === key);

                return {
                  id: key,
                  fullName: intern?.fullName || "",
                };
              }),
            ),
          );
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={candidates}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner />
              Loading...
            </div>
          }
          emptyContent={<div>No candidate found!</div>}
        >
          {candidates.map((candidate: Candidate, index: number) => (
            <TableRow key={candidate.id}>
              {(colKey) => (
                <TableCell>{renderCell(candidate, colKey, index)}</TableCell>
              )}
            </TableRow>
          ))}
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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />

      <Pagination
        className="m-4 flex justify-center"
        isCompact
        loop
        showControls
        total={candidateData?.totalPages ? Number(candidateData.totalPages) : 0}
        initialPage={pageIndex}
        onChange={(page) => {
          setPageIndex(page);
        }}
      />
    </div>
  );
}
