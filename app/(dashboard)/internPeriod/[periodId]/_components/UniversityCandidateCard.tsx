"use client";
import React from "react";

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
import { ViewIcon } from "../../_components/Icons";
import { useUniversityCandidateContext } from "../_providers/UniversityCandidateProvider";
import ActionBar from "./ActionBar";
import { Pagination } from "@nextui-org/pagination";

export default function UniversityCandidateCard() {
  const { isLoading, data, setPageIndex } = useUniversityCandidateContext();

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
    { key: "status", label: "Status" },

    {
      key: "desiredPosition",
      label: "Desired Position",
    },
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
    </div>
  );
}
