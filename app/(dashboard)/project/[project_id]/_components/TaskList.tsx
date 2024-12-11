import React, { Key } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import TaskModal from "./TaskModal";
import TaskDeleteModal from "./TaskDeleteModal";
import { Tabs, Tab } from "@nextui-org/tabs";
import { useProjectDetailContext } from "../../_providers/ProjectDetailProvider";
import { ProjectTask } from "@/data-store/project/project-task.store";
import Loading from "@/components/Loading";
import TaskFilter from "./TaskFilter";
import { Pagination } from "@nextui-org/pagination";
import { Chip, ChipProps } from "@nextui-org/chip";
import { truncateText } from "@/app/util";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { EllipsisIcon } from "@/app/(dashboard)/internPeriod/_components/Icons";

export default function TaskList() {
  const {
    projectTasks,
    isLoadingProjectTask,
    setProjectTaskPageIndex,
    setProjectTaskFilter,
    projectTaskFilter,
    projectSummary,
  } = useProjectDetailContext();

  const statusColorMap: Record<string, ChipProps["color"]> = {
    NotStarted: "default",
    InProgress: "warning",
    InReview: "warning",
    Done: "success",
    OverDue: "danger",
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "summary", label: "Summary" },
    { key: "startDate", label: "Start Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "priority", label: "Priority" },
    { key: "difficulty", label: "Difficulty" },
    { key: "status", label: "Status" },
    { key: "memberName", label: "Member Name" },
    { key: "position", label: "Position" },
    { key: "completionProgress", label: "Progress" },
    { key: "progressAssessment", label: "Evaluate Score" },
    { key: "actions", label: "Actions" },
  ];

  const statusOptions = [
    {
      key: "0",
      value: "Not Started",
    },
    {
      key: "1",
      value: "In Progress",
    },
    {
      key: "2",
      value: "In Review",
    },
    {
      key: "3",
      value: "Done",
    },
    {
      key: "4",
      value: "Over Due",
    },
  ];

  const renderCell = (item: ProjectTask, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        const shortTitle = truncateText(item.summary, 8);

        return (
          <Popover placement="top" showArrow offset={10}>
            <PopoverTrigger>{shortTitle}</PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-base">{item.title}</div>
              </div>
            </PopoverContent>
          </Popover>
        );
      case "summary":
        const shortSummary = truncateText(item.summary, 8);

        return (
          <Popover placement="top" showArrow offset={10}>
            <PopoverTrigger>{shortSummary}</PopoverTrigger>
            <PopoverContent>
              <div className="px-1 py-2">
                <div className="text-base">{item.summary}</div>
              </div>
            </PopoverContent>
          </Popover>
        );
      case "startDate":
        return item.startDate.split("T")[0];
      case "dueDate":
        return item.dueDate.split("T")[0];
      case "priority":
        return item.priority;
      case "difficulty":
        return item.difficulty;
      case "status":
        return (
          <Chip
            className="text-xs capitalize"
            color={statusColorMap[item.status]}
            size="sm"
            variant="flat"
          >
            {item.status}
          </Chip>
        );
      case "memberName":
        return item.assignedPerson.assignedPerson;
      case "position":
        return item.assignedPerson.position;
      case "completionProgress":
        return item.completionProgress;
      case "progressAssessment":
        return item.progressAssessment;
      case "actions":
        return (
          <div className="flex">
            <TaskModal
              mode="edit"
              projectId={projectSummary?.id as string}
              selectedTaskInfo={item}
            />
            <TaskDeleteModal taskId={item.id} />
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <EllipsisIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions">
                <DropdownItem key="edit" className="flex items-center">
                  <TaskModal
                    mode="edit"
                    projectId={projectSummary?.id as string}
                    selectedTaskInfo={item}
                  />
                </DropdownItem>
                <DropdownItem key="delete" className="flex items-center">
                  <TaskDeleteModal taskId={item.id} />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">Task Lists</p>

        <TaskModal mode="create" projectId={projectSummary?.id as string} />
      </div>

      <Tabs
        key={"md"}
        size={"md"}
        color="primary"
        fullWidth
        aria-label="Tabs sizes"
        onSelectionChange={(key) =>
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, {
              Status: key as string,
            }),
          )
        }
      >
        {statusOptions.map((statusOption) => (
          <Tab key={statusOption.key} title={statusOption.value} />
        ))}
      </Tabs>
      <TaskFilter />

      <Table>
        <TableHeader
          columns={columns.filter((column) => {
            if (
              (projectTaskFilter?.Status === "0" ||
                projectTaskFilter?.Status === "1" ||
                projectTaskFilter?.Status === "2") &&
              (column.key == "completionProgress" ||
                column.key == "progressAssessment")
            ) {
              return false;
            }
            if (
              (projectTaskFilter?.Status === "3" ||
                projectTaskFilter?.Status === "4") &&
              column.key == "actions"
            ) {
              return false;
            } else {
              return true;
            }
          })}
        >
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={projectTasks?.tasks ?? []}
          emptyContent={"No rows to display."}
          isLoading={isLoadingProjectTask}
          loadingContent={<Loading />}
        >
          {(item) => (
            <TableRow key={item.id} className="hover:cursor-pointer">
              {columns
                .filter((column) => {
                  if (
                    (projectTaskFilter?.Status === "0" ||
                      projectTaskFilter?.Status === "1" ||
                      projectTaskFilter?.Status === "2") &&
                    (column.key === "completionProgress" ||
                      column.key === "progressAssessment")
                  ) {
                    return false;
                  } else if (
                    (projectTaskFilter?.Status === "3" ||
                      projectTaskFilter?.Status === "4") &&
                    column.key === "actions"
                  ) {
                    return false;
                  }

                  return true;
                })
                .map((column) => (
                  <TableCell key={column.key}>
                    {renderCell(item, column.key)}
                  </TableCell>
                ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        className="m-4 flex justify-center"
        isCompact
        loop
        showControls
        total={projectTasks?.totalPages ? Number(projectTasks?.totalPages) : 0}
        initialPage={
          projectTasks?.pageIndex ? Number(projectTasks?.pageIndex) : 1
        }
        onChange={(page) => {
          setProjectTaskPageIndex(page);
        }}
      />
    </div>
  );
}
