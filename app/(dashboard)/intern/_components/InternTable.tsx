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
import React, { Key } from "react";
import { EditIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { Tooltip } from "@nextui-org/tooltip";
import { Pagination } from "@nextui-org/pagination";
import { useMutation, useQuery } from "@tanstack/react-query"; //get request
import { apiEndpoints } from "@/libs/config";
import { DeleteIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { Spinner } from "@nextui-org/spinner";
import Link from "next/link";
const statusColorMap: Record<string, ChipProps["color"]> = {
  Approved: "success",
  Rejected: "danger",
  Pending: "warning",
};

export type AccountTableProps = {
  selectedInterns: Set<string>;
  setSelectedInterns: (selectedInterns: Set<string>) => void;
};
export default function InternsTable(props: AccountTableProps) {
  const {
    data: allData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["sharedAllData"],
    queryFn: async () => {
      const candidateData = await fetch(apiEndpoints.candidate).then((res) =>
        res.json(),
      );

      return {
        candidates: candidateData?.data?.pagingData || [],
      };
    },
  });

  const candidates = allData?.candidates || [];

  const formatDateOfBirth = (dob: string) => {
    const date = new Date(dob); // Convert string to Date object
    const day = String(date.getDate()); // Get day and pad with 0 if necessary
    const month = String(date.getMonth() + 1); // Months are 0-indexed, so add 1
    const year = String(date.getFullYear()); // Get last 2 digits of the year

    return `${day}/${month}/${year}`; // Return formatted date
  };

  const deleteInternMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(apiEndpoints.candidate + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json()),

    onError: (error) => {
      console.error("Error:", error);
    },

    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this period?",
    );

    if (confirmDelete) {
      deleteInternMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: "fullName",
      label: "FULL NAME",
    },
    {
      key: "group",
      label: "GROUP",
    },
    {
      key: "doB",
      label: "Date of birth",
    },
    {
      key: "phoneNumber",
      label: "PHONE",
    },
    {
      key: "personalEmail",
      label: "EMAIL",
    },
    {
      key: "cvUri",
      label: "CV",
    },
    {
      key: "gpa",
      label: "GPA",
    },
    {
      key: "universityId",
      label: "UNIVERSITY  ",
    },

    {
      key: "status",
      label: "STATUS",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = React.useCallback(
    (candidate: any, columnKey: React.Key) => {
      const cellValue = candidate[columnKey as keyof typeof candidate];

      switch (columnKey) {
        case "fullName":
          return <div>{candidate.fullName}</div>;
        case "group":
          return <div>{candidate.internPeriodViewModel.name}</div>;
        case "doB":
          return <div>{formatDateOfBirth(candidate.doB)}</div>;
        case "phoneNumber":
          return <div>{candidate.phoneNumber}</div>;
        case "personalEmail":
          return <div>{candidate.personalEmail}</div>;
        case "cvUri":
          return (
            <Link className="text-blue-500 underline" href={candidate.cvUri}>
              Link
            </Link>
          );
        case "gpa":
          return <div>{candidate.gpa}</div>;
        case "role":
          return <div>{candidate.role}</div>;
        case "universityId":
          return <div>{candidate.universityViewModel.name}</div>;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[candidate.status]}
              size="md"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="flex gap-2">
              <Tooltip content="Edit">
                <span className="cursor-pointer text-lg active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip content="Delete">
                <button
                  onClick={() => handleDelete(candidate.id)}
                  className="cursor-pointer text-lg active:opacity-50"
                >
                  <DeleteIcon />
                </button>
              </Tooltip>
            </div>
          );
      }
    },
    [],
  );

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <>
      <div>
        <Table
          selectionMode="multiple"
          className="m-5 w-auto"
          onSelectionChange={(keys) => {
            props.setSelectedInterns(keys as Set<string>);
          }}
        >
          <TableHeader columns={columns}>
            {(columns) => (
              <TableColumn key={columns.key}>{columns.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={candidates}>
            {(candidate: any) => (
              <TableRow key={candidate.id}>
                {(colKey) => (
                  <TableCell>{renderCell(candidate, colKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          className="m-4 flex justify-center"
          isCompact
          loop
          showControls
          total={12}
          initialPage={1}
        />
      </div>
    </>
  );
}
