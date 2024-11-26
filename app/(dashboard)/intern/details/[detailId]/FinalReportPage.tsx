"use client";

import { Criteria } from "@/app/(dashboard)/intern/_types/GetCriterias";
import { formatedDate } from "@/app/util";
import { API_ENDPOINTS } from "@/libs/config";
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
import { useParams } from "next/navigation";
import React, { Key, useMemo } from "react";

export default function FinalReportPage() {
  const params = useParams();
  const candidateId = params.detailId as string;

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["data", candidateId],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.internshipReport}/${candidateId}/internship-report-details`,
      );
      const candidate = await response.json();

      return candidate;
    },
  });

  console.log(candidateId);

  const internPeriodViewReport = data?.data?.internPeriodViewReport || {};
  const candidateInfor = data?.data || {};
  const complianceEvaluate = data?.data?.complianceEvaluation || {};
  const complianceCriterias = complianceEvaluate?.complianceCriterias || [];
  const workPerformance = data?.data?.workPerformanceEvaluationFinal || [];
  console.log(workPerformance);
  const columns = useMemo(
    () => [
      { key: "no", label: "NO" },
      { key: "content", label: "Criteria content" },
      { key: "unit", label: "Unit" },
      { key: "percent", label: "Percent" },
      { key: "maxScore", label: "Max score" },
      { key: "evaluateScore", label: "Evaluate score" },
      { key: "finalScore", label: "Final score" },
      { key: "note", label: "Note" },
    ],
    [],
  );

  const renderCell = (criterias: Criteria, columnKey: Key, index: number) => {
    const cellValue = criterias[columnKey as keyof Criteria];

    switch (columnKey) {
      case "no":
        return <div>{index + 1}</div>;
      case "content":
        return <p className="text-xs">{criterias.content}</p>;
      case "unit":
        return <p className="text-xs">Score</p>;
      case "percent":
        return <p className="text-xs">{criterias.percent}%</p>;
      case "maxScore":
        return <p className="text-xs">{criterias.maxScore}</p>;
      case "evaluateScore":
        return <p className="text-xs">{criterias.evaluateScore}</p>;
      case "finalScore":
        return <p className="text-xs">{criterias.finalScore}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="text-center text-3xl font-semibold">
        INTERNSHIP FINAL REPORT
      </div>
      <h1 className="mb-3 mt-2 text-lg font-semibold">General Information</h1>

      <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
        <div>
          <h1 className="mb-3 font-semibold">Candidate Information</h1>
          <div className="mb-2">Full name: {candidateInfor.candidateName}</div>
          <div className="mb-2">University: {candidateInfor.university}</div>
          <div>Student Code: {candidateInfor.studentCode}</div>
        </div>
        <div>
          <div className="mb-3 font-semibold">Candidate Information</div>

          <div className="mb-2">
            Internship Name: {internPeriodViewReport.name}
          </div>
          <div className="mb-2">
            Start Date: {formatedDate(internPeriodViewReport.startDate)}
          </div>
          <div>End Date: {formatedDate(internPeriodViewReport.endDate)}</div>
        </div>
        <div>
          <h1 className="mb-3 font-semibold">Company Information</h1>
          <div>Company Name: Amazing Tech</div>
        </div>
      </div>

      <h1 className="mb-3 mt-3 text-lg font-semibold">Compliance Evaluation</h1>
      <div>
        <div>
          <Table className="w-full">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={complianceCriterias}
              loadingState={isLoading ? "loading" : "idle"}
              loadingContent={
                <div className="flex items-center gap-2">
                  <Spinner />
                  Loading...
                </div>
              }
              emptyContent={<div>No evaluate found!</div>}
            >
              {complianceCriterias.map((criteria: Criteria, index: number) => (
                <TableRow key={criteria.id}>
                  {(colKey) => (
                    <TableCell>{renderCell(criteria, colKey, index)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div>
          <div>Total Percent: {complianceEvaluate.totalPercent}%</div>
          <div>
            Total Converted Score: {complianceEvaluate.totalConvertedScore}
          </div>
          <div>Result: {complianceEvaluate.result}</div>
        </div>
      </div>

      <div>
        <h1 className="mb-3 mt-3 text-lg font-semibold">Evaluation Total</h1>
        <h1 className="mb-3 mt-3 text-lg font-semibold">
          Overall Score: {candidateInfor.overallScore}
        </h1>
        <h1 className="mb-3 mt-3 text-lg font-semibold">Result</h1>
      </div>
    </div>
  );
}
