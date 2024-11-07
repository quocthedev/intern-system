"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiEndpoints } from "@/libs/config";
import { Tooltip } from "@nextui-org/tooltip";
import {
  DeleteIcon,
  EditIcon,
} from "@/app/(dashboard)/question/_components/Icons";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import ActionBar from "@/app/(dashboard)/question/_components/ActionBar";
import Link from "next/link";
export default function QuestionBankPage() {
  const params = useParams();

  const techId = params.questionsbank;

  const { isLoading, error, data } = useQuery({
    queryKey: ["data", techId],
    queryFn: async () => {
      const response = await fetch(
        `${apiEndpoints.interviewQuestion}/technology/${techId}/interview-questions`,
      );

      const questions = response.json();
      return questions;
    },
  });

  // console.log(data?.data?.interviewQuestions); //Chấm thêm cục data để lấy đc dữ liệu bên trong

  const questionsData = data?.data?.interviewQuestions;
  const techName = data?.data?.technologyName;
  console.log(techName);

  const columns = [
    {
      key: "no",
      label: "NO",
    },
    {
      key: "content",
      label: "CONTENT",
    },
    {
      key: "imageUri",
      label: "IMAGE URI",
    },
    {
      key: "difficulty",
      label: "DIFFICULTY",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const renderCell = React.useCallback(
    (question: any, columnKey: React.Key, index: number) => {
      const cellValue = question[columnKey as keyof typeof question];

      switch (columnKey) {
        case "no":
          return <div>{index + 1}</div>;
        case "content":
          return <div>{question.content}</div>;
        case "imageUri":
          return <div>{question.imageUri}</div>;
        case "difficulty":
          return <div>{question.difficulty}</div>;
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit ">
                <button
                  className="cursor-pointer text-lg text-default-400 active:opacity-50"
                  // onClick={() =>
                  //   openEditModal(
                  //     univer.id,
                  //     univer.name,
                  //     univer.abbreviation,
                  //     univer.address,
                  //   )
                  // }
                >
                  <EditIcon />
                </button>
              </Tooltip>
              <Tooltip color="danger" content="Delete">
                <button
                  className="cursor-pointer text-lg text-danger active:opacity-50"
                  // onClick={() => openModalDelete(univer.id)}
                >
                  <DeleteIcon />
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

  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Question List Management
      </h1>
      <div className="flex">
        <Link href="/question" className="bold font-semibold text-blue-600">
          Question Bank
        </Link>
        <span className="mx-2"> &gt; </span>
        <div className="font-semibold">{techName}</div>
      </div>
      <ActionBar />
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={questionsData ?? []}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={
            <div className="flex items-center gap-2">
              <Spinner />
              Loading...
            </div>
          }
          emptyContent={<div>No question found!</div>}
        >
          {questionsData?.map(
            (
              question: any,
              index: number, // Use .map to handle the index
            ) => (
              <TableRow key={question.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(question, columnKey, index)}
                  </TableCell> // Pass index to renderCell
                )}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  );
}
