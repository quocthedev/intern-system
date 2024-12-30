"use client";
import { CreateQuestionIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { formatDate, formatedTimeToMinutes } from "@/app/util/format";
import { API_ENDPOINTS } from "@/libs/config";
import { Chip, ChipProps } from "@nextui-org/chip";
import { Skeleton } from "@nextui-org/skeleton";
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
import { useInterviewDetailContext } from "@/app/(dashboard)/interview/_providers/InterviewDetailProvider";
import { Tab, Tabs } from "@nextui-org/tabs";
import RescheduleModal from "@/app/(dashboard)/interview/details/[detailId]/RescheduleModal";
import { getCookie } from "@/app/util";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Confirmed: "success",
  Refused: "danger",
  Reschedule: "warning",
  NotYet: "primary",
};

const statusOptions = [
  {
    key: "all",
    value: "All",
  },
  {
    key: "0",
    value: "Not Yet",
  },
  {
    key: "1",
    value: "Confirmed",
  },
  {
    key: "3",
    value: "Reschedule",
  },
  {
    key: "2",
    value: "Reject",
  },
];

export default function InterViewDetailPage() {
  const params = useParams();
  const interviewScheduleId = params.detailId as string;

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["data", interviewScheduleId],
    queryFn: async () => {
      const response = await fetch(
        API_ENDPOINTS.interviewSchedule +
          "/" +
          interviewScheduleId +
          "/interschedule-details",
      );
      const interviewSchedules = await response.json();

      return interviewSchedules;
    },
  });

  const { interviewDetailData, filter, setFilter, removeAllFilter } =
    useInterviewDetailContext();

  const interviewScheduleData = data?.data || {};
  const candidateData = interviewDetailData?.interviewScheduleDetails || [];

  const role = getCookie("userRole");

  const columnCandidate = [
    {
      key: "no",
      label: "No",
    },
    {
      key: "candidateName",
      label: "Candidate name",
    },
    {
      key: "universityEmail",
      label: "University email",
    },
    {
      key: "interviewDate",
      label: "Interview date",
    },
    {
      key: "startTime",
      label: "Start time",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "reason",
      label: "Reason",
    },
    {
      key: "action",
      label: "Action",
    },
  ];

  const renderCellCandidate = React.useCallback(
    (candidate: any, columnKey: React.Key, index: number) => {
      const cellValue = candidate[columnKey as keyof typeof candidate];

      switch (columnKey) {
        case "no":
          return <div>{index + 1}</div>;
        case "candidateName":
          return <div>{candidate.candidateName}</div>;
        case "universityEmail":
          return <div>{candidate.candidateUniversityEmail}</div>;
        case "interviewDate":
          return <div>{formatDate(candidate.interviewDate)}</div>;
        case "startTime":
          return <div>{candidate.startTime}</div>;
        case "timeDuration":
          return (
            <div>{formatedTimeToMinutes(candidate.timeDuration)} minutes</div>
          );
        case "status":
          return (
            <Chip
              className="text-xs capitalize"
              color={statusColorMap[candidate.status]}
              size="sm"
              variant="flat"
            >
              {candidate.status}
            </Chip>
          );

        case "reason":
          if (
            candidate.status === "Refused" ||
            candidate.status === "Reschedule"
          ) {
            return (
              <Chip size="sm">
                <Tooltip content={candidate.reason}>Show reason</Tooltip>
              </Chip>
            );
          } else {
            return <></>;
          }

        case "action":
          if (candidate.status === "Confirmed") {
            return (
              <div className="flex items-center">
                <Tooltip content="Create question for candidate">
                  <Link
                    href={`/intern/details/${candidate.candidateId}/interview-information`}
                    className="w-full"
                  >
                    <button className="flex cursor-pointer items-center">
                      <CreateQuestionIcon />
                    </button>
                  </Link>
                </Tooltip>
              </div>
            );
          }
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div className="flex items-center">
          <Link
            href="/interview"
            className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Interview Schedules
          </Link>
          <span className="mx-2"> &gt; </span>
          <span className="font-semibold">Internship schedule details</span>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg bg-white p-4 shadow-md">
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
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
          <div className="flex justify-start border-b pb-2 text-xl font-semibold">
            <span>{interviewScheduleData?.title}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Interviewer name:</span>
              <span className="w-1/2 font-bold">
                {interviewScheduleData?.interviewerName}
              </span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Interview type :</span>
              <span>{interviewScheduleData?.interviewFormat} </span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Duration :</span>
              <span>
                {formatedTimeToMinutes(interviewScheduleData?.timeDuration)}{" "}
                minutes
              </span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/2 font-medium">Location:</span>
              {interviewScheduleData?.interviewFormat == "Online" ? (
                <div className="text-blue-600 underline">
                  {interviewScheduleData?.interviewLocation}
                </div>
              ) : (
                <div>{interviewScheduleData?.interviewLocation}</div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="mb-2 mt-8 text-lg">List of interview candidates</div>

        {role === "Mentor" || role === "Administrator" ? (
          <div>
            {candidateData.find(
              (candidate: any) => candidate?.status === "Reschedule",
            ) ? (
              <RescheduleModal disabled={false} />
            ) : (
              <RescheduleModal disabled={true} />
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <Tabs
        className="mb-4"
        key={"md"}
        size={"md"}
        color="primary"
        fullWidth
        aria-label="Tabs sizes"
        onSelectionChange={(key) => {
          if (key === "all") {
            removeAllFilter();
          } else {
            setFilter(
              Object.assign({}, filter, {
                Status: key as string,
              }),
            );
          }
        }}
      >
        {statusOptions.map((statusOption) => (
          <Tab key={statusOption.key} title={statusOption.value} />
        ))}
      </Tabs>
      <Table>
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
          {candidateData.map((candidate: any, index: number) => (
            <TableRow key={candidate.candidateId}>
              {(colKey) => (
                <TableCell>
                  {renderCellCandidate(candidate, colKey, index)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
