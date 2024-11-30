"use client";

import {
  CandidateIcon,
  ViewIcon,
} from "@/app/(dashboard)/internPeriod/_components/Icons";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { Button } from "@nextui-org/button";
import ImportExcelModal2 from "@/app/(dashboard)/internPeriod/[periodDetail]/ImportExcelModal2";
import { Input } from "@nextui-org/input";
import { toast } from "sonner";

export default function PeriodDetailPage() {
  const params = useParams();
  const internPeriodId = params.periodDetail as string;
  const [universityId, setUniversityId] = useState();
  const [updateData, setUpdateData] = useState({
    name: "",
    maxCandidateQuantity: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  console.log(universityId);

  const { isLoading, data, refetch } = useQuery({
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

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch(API_ENDPOINTS.internPeriod + "/" + internPeriodId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      refetch();
    },
  });

  useEffect(() => {
    if (internPeriodData) {
      setUpdateData({
        name: internPeriodData.name || "",
        maxCandidateQuantity: internPeriodData.maxCandidateQuantity || "",
        description: internPeriodData.description || "",
        startDate: internPeriodData.startDate || "",
        endDate: internPeriodData.endDate || "",
      });
    }
  }, [internPeriodData]);

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
      key: "phoneNumber",
      label: "Phone",
    },
    {
      key: "personalEmail",
      label: "Email",
    },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "desiredPosition",
      label: "Desired Position",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const renderCellCandidate = React.useCallback(
    (candidate: any, columnKey: React.Key) => {
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
        case "action":
          return (
            <div>
              <Tooltip content="View detail">
                <button
                  className="cursor-pointer"
                  onClick={() => window.open(`/intern/details/${candidate.id}`)}
                >
                  <ViewIcon />
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
            <Button
              color="primary"
              size="md"
              onClick={() => updateMutation.mutate()}
              // isLoading={updateMutation.isLoading}
            >
              Update intern period
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Name:</span>
              <Input
                className="w-1/2 font-bold"
                onChange={(e) =>
                  setUpdateData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Duration :</span>
              <span>{internPeriodData?.internshipDuration} months</span>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Start Date:</span>
              <Input
                // value={formatedDate(internPeriodData?.startDate)}
                onChange={(e) =>
                  setUpdateData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              >
                {formatedDate(internPeriodData?.startDate)}
              </Input>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">End Date:</span>
              <Input
                // value={formatedDate(internPeriodData?.endDate)}
                onChange={(e) =>
                  setUpdateData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
              >
                {formatedDate(internPeriodData?.endDate)}
              </Input>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Max Candidates:</span>
              <Input
                value={internPeriodData?.maxCandidateQuantity}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    maxCandidateQuantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Current Universitites:</span>
              <span>{internPeriodData?.currentUniversityQuantity}</span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">
                Total number of current candidates:
              </span>
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
              <Input
                value={internPeriodData?.description}
                onChange={(e) =>
                  setUpdateData({ ...updateData, description: e.target.value })
                }
              />
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
                  onPress={() => setUniversityId(e.id)}
                >
                  <div>
                    <ImportExcelModal2
                      internPeriodId={internPeriodId}
                      universityId={e.id}
                    />
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
