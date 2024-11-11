"use client";

import { apiEndpoints } from "@/libs/config";
import { Button } from "@nextui-org/button";
import { Chip, ChipProps } from "@nextui-org/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
const statusColorMap: Record<string, ChipProps["color"]> = {
  Inprocess: "success",
  Rejected: "danger",
  Pending: "warning",
};

export default function PeriodDetailPage() {
  const params = useParams();
  const internPeriodId = params.periodDetail as string;
  const [universityId, setUniversityId] = useState();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const formatDateOfBirth = (dob: string) => {
    const date = new Date(dob);
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1);
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
  };

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["data", internPeriodId],
    queryFn: async () => {
      const [candidateResponse, internPeriodResponse, universityResponse] =
        await Promise.all([
          fetch(
            `${apiEndpoints.internPeriod}/${internPeriodId}/universities/candidates`,
          ),
          fetch(`${apiEndpoints.internPeriod}/${internPeriodId}`),
          fetch(`${apiEndpoints.internPeriod}/${internPeriodId}/universities`),
        ]);

      const candidate = await candidateResponse.json();
      const internPeriod = await internPeriodResponse.json();
      const university = await universityResponse.json();

      return {
        candidateData: candidate.data,
        internPeriodData: internPeriod.data,
        universityData: university.data,
      };
    },
  });

  const universityName = data?.candidateData; //Data of canidate
  const internPeriodData = data?.internPeriodData;
  const univerData = data?.universityData;

  const universitesData = univerData?.universities || [];

  // const candidateData =
  //   data?.candidateData?.flatMap((data: any) => data.candidates) || [];

  const handleSelectUni = async (id: any) => {
    setUniversityId(id);
  };

  const columnCandidate = [
    {
      key: "fullName",
      label: "FULL NAME",
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
      key: "desiredPosition",
      label: "Desired Position",
    },
  ];

  const columnUniversity = [
    {
      key: "name",
      label: "UNIVERSITY NAME",
    },
    { key: "action", label: "ACTIONS" },
  ];

  const renderCellCandidate = React.useCallback(
    (candidate: any, columnKey: React.Key) => {
      const cellValue = candidate[columnKey as keyof typeof candidate];

      switch (columnKey) {
        case "fullName":
          return <div>{candidate.fullName}</div>;
        case "doB":
          return <div>{formatDateOfBirth(candidate.doB)}</div>;
        case "phoneNumber":
          return <div>{candidate.phoneNumber}</div>;
        case "personalEmail":
          return <div>{candidate.personalEmail}</div>;
        case "desiredPosition":
          return <div>{candidate.desiredPosition}</div>;
        default:
          return cellValue;
      }
    },
    [],
  );

  const renderCellUniversity = React.useCallback(
    (uni: any, coluKey: React.Key) => {
      const cellValue = uni[coluKey as keyof typeof uni];

      switch (coluKey) {
        case "name":
          return <div>{uni.name}</div>;
        case "action":
          return (
            <Button onClick={() => handleSelectUni(uni.id)}>
              View candidate list
            </Button>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="flex h-full w-full flex-col p-6">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Intern period detail
      </h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div className="flex items-center">
          <Link
            href="/internPeriod"
            className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Internship period
          </Link>
          <span className="mx-2"> &gt; </span>
          <span className="font-semibold"> Internship period information </span>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <span>Name: {internPeriodData?.name}</span>
        <span>Start Date: {internPeriodData?.startDate}</span>
        <span>End Date: {internPeriodData?.endDate}</span>
        <span>Duration (months): {internPeriodData?.internshipDuration}</span>
        <span>Description: {internPeriodData?.description}</span>
        <span>
          Max candidate attended: {internPeriodData?.maxCandidateQuantity}
        </span>
        <span>
          Current candidate attended:{" "}
          {internPeriodData?.currentCandidateQuantity}
        </span>
        <span>Status: {internPeriodData?.status}</span>
      </div>

      {/* <div>
        <span className="font-semibold text-lime-700 sm:-mr-1">
          Selected University:
        </span>

        <Dropdown>
          <DropdownTrigger className="mb-4 mt-3 sm:mb-4 sm:mt-3">
            <Button variant="bordered" className="text-sm">
              {isLoading ? (
                <Spinner size="sm" />
              ) : universityId ? (
                getUniversityNameById(universityId)
              ) : (
                "Select"
              )}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Dynamic Actions"
            items={universityName}
            selectionMode="single"
            onAction={(id) => handleSelectUni(id)}
          >
            {(uni: any) => (
              <DropdownItem key={uni.id}>{uni.universityName}</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div> */}

      <Table className="m-5 w-auto">
        <TableHeader columns={columnUniversity}>
          {(columns) => (
            <TableColumn key={columns.key}>{columns.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={universitesData || []}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner /> Loading...
            </div>
          }
        >
          {(uni: any) => (
            <TableRow key={uni.id}>
              {(colKey) => (
                <TableCell>{renderCellUniversity(uni, colKey)}</TableCell>
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalBody>
            {/* <Table className="m-5 w-auto">
        <TableHeader columns={columnCandidate}>
          {(columns) => (
            <TableColumn key={columns.key}>{columns.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={candidateData}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner /> Loading...
            </div>
          }
        >
          {(candidate: any) => (
            <TableRow key={candidate.id}>
              {(colKey) => (
                <TableCell>{renderCellCandidate(candidate, colKey)}</TableCell>
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
      /> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
