"use client";

import { CandidateIcon } from "@/app/(dashboard)/internPeriod/_components/Icons";
import { formatedDate } from "@/app/util";
import { API_ENDPOINTS } from "@/libs/config";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Spinner } from "@nextui-org/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Tooltip } from "@nextui-org/tooltip";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@nextui-org/button";

export default function PeriodDetailPage() {
  const params = useParams();
  const internPeriodId = params.periodDetail as string;

  const { isLoading, data } = useQuery({
    queryKey: ["data", internPeriodId],
    queryFn: async () => {
      const [candidateResponse, internPeriodResponse] = await Promise.all([
        fetch(
          `${API_ENDPOINTS.internPeriod}/${internPeriodId}/universities/candidates`,
        ),
        fetch(`${API_ENDPOINTS.internPeriod}/${internPeriodId}/universities`),
      ]);

      const candidate = await candidateResponse.json();
      const internPeriod = await internPeriodResponse.json();

      return {
        candidateData: candidate.data,
        internPeriodData: internPeriod.data,
      };
    },
  });

  const universitesData = data?.candidateData || [];
  const internPeriodData = data?.internPeriodData || [];

  console.log(internPeriodData);

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

  const renderCellCandidate = React.useCallback(
    (candidate: any, columnKey: React.Key) => {
      const cellValue = candidate[columnKey as keyof typeof candidate];

      switch (columnKey) {
        case "fullName":
          return <div>{candidate.fullName}</div>;
        case "doB":
          return <div>{candidate.doB}</div>;
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

  const customAccordionTitle = (
    universityName: string,
    candidateQuantity: number,
  ) => {
    return (
      <div className="flex items-center gap-2">
        {universityName}
        <Tooltip content={<div>Number of candidates: {candidateQuantity}</div>}>
          <div>
            <CandidateIcon />
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full flex-col p-6">
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

      {isLoading ? (
        <div className="rounded-lg bg-white p-4 shadow-md">
          <Skeleton className="rounded-lg">
            <div className="mb-5 text-2xl font-semibold text-amber-600">
              Intern Period Details
            </div>
          </Skeleton>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-4 shadow-md">
          <div className="mb-5 flex w-full items-center justify-between">
            <h2 className="text-2xl font-semibold text-amber-600">
              Intern Period Details
            </h2>
            <Button color="primary" size="sm">
              Update intern period
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Name:</span>
              <span className="w-1/2 font-bold">{internPeriodData?.name}</span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Duration :</span>
              <span>{internPeriodData?.internshipDuration} (months)</span>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Start Date:</span>
              <span>{formatedDate(internPeriodData?.startDate)}</span>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">End Date:</span>
              <span>{formatedDate(internPeriodData?.endDate)}</span>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Max Candidates:</span>
              <span>{internPeriodData?.maxCandidateQuantity}</span>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Current Universitites:</span>
              <span>{internPeriodData?.currentUniversityQuantity}</span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Current Candidates:</span>
              <span>{internPeriodData?.currentCandidateQuantity}</span>
            </div>

            <div className="flex items-center">
              <span className="w-1/2 font-medium">Status:</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${internPeriodData?.status === "InProgress" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}
              >
                {internPeriodData?.status}
              </span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Description:</span>
              <span>{internPeriodData?.description}</span>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div>
          <Skeleton className="mt-4 rounded-lg">
            <div className="h-12">Accordion</div>
          </Skeleton>
          <Skeleton className="mt-4 rounded-lg">
            <div className="h-12">Accordion</div>
          </Skeleton>
        </div>
      ) : (
        <div>
          <Accordion className="mt-4 gap-4 rounded-lg p-0" variant="splitted">
            {universitesData.map((e: any) => {
              return (
                <AccordionItem
                  key={e.id}
                  title={customAccordionTitle(
                    e.universityName,
                    e.candidateQuantity,
                  )}
                >
                  <div>
                    <Table
                      classNames={{
                        wrapper: "p-0",
                      }}
                      shadow="none"
                    >
                      <TableHeader columns={columnCandidate}>
                        {(columns) => (
                          <TableColumn key={columns.key}>
                            {columns.label}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody
                        items={e.candidates}
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
                              <TableCell>
                                {renderCellCandidate(candidate, colKey)}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </div>
  );
}
