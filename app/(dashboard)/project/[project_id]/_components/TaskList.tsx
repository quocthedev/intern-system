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

export default function TaskList() {
  const {
    projectTasks,
    isLoadingProjectTask,
    setProjectTaskPageIndex,
    setProjectTaskFilter,
    projectTaskFilter,
    projectSummary,
  } = useProjectDetailContext();

  const columns = [
    { key: "title", label: "Title" },
    { key: "summary", label: "Summary" },
    { key: "startDate", label: "Start Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "priority", label: "Priority" },
    { key: "difficulty", label: "Difficulty" },
    { key: "status", label: "Status" },
    { key: "memberName", label: "Member Name" },
    { key: "completionProgress", label: "Completion" },
    { key: "progressAssessment", label: "Assessment" },
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
        return <p className="max">{item.title}</p>;
      case "summary":
        return item.summary;
      case "startDate":
        return item.startDate.split("T")[0];
      case "dueDate":
        return item.dueDate.split("T")[0];
      case "priority":
        return item.priority;
      case "difficulty":
        return item.difficulty;
      case "status":
        return item.status;
      case "memberName":
        return item.assignedPerson.assignedPerson;
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
        fullWidth
        aria-label="Tabs sizes"
        onSelectionChange={(key) =>
          setProjectTaskFilter(
            Object.assign({}, projectTaskFilter, { Status: key as string }),
          )
        }
      >
        {statusOptions.map((statusOption) => (
          <Tab key={statusOption.key} title={statusOption.value} />
        ))}
      </Tabs>
      <TaskFilter />

      <Table selectionMode="single">
        <TableHeader columns={columns}>
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
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
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
