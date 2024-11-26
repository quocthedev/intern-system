import React, { Key } from "react";
import { Task } from "../../_types/Project";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import TaskModal from "./TaskModal";
import { RelatedUser } from "../page";
import TaskDeleteModal from "./TaskDeleteModal";
import { Tabs, Tab } from "@nextui-org/tabs";

export type TaskListProps = {
  tasks: Task[];
  relatedUsers: RelatedUser[];
  projectId: string;
  filterTask: number;
  setFilterTask: (filterTask: number) => void;
  className?: string;
};

export default function TaskList(props: TaskListProps) {
  const [selectedStatus, setSelectedStatus] = React.useState("0");

  const columns = [
    { key: "title", label: "Title" },
    // { key: "summary", label: "Summary" },
    // { key: "description", label: "Description" },
    { key: "startDate", label: "Start Date" },
    { key: "dueDate", label: "Due Date" },

    { key: "priority", label: "Priority" },
    { key: "difficulty", label: "Difficulty" },
    { key: "status", label: "Status" },
    { key: "memberName", label: "Member Name" },
    { key: "completionProgress", label: "Completion" },
    { key: "progressAssessment", label: "Assessment" },
    { key: "note", label: "Note" },
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

  const renderCell = (item: Task, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        return <p className="max">{item.title}</p>;
      case "summary":
        return item.summary;
      case "description":
        return item.description;
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
        return item.memberName;
      case "completionProgress":
        return item.completionProgress;
      case "progressAssessment":
        return item.progressAssessment;
      case "note":
        return item.note;
      case "actions":
        return (
          <div className="flex">
            <TaskModal
              mode="edit"
              relatedUsers={props.relatedUsers}
              projectId={props.projectId}
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

        <TaskModal
          mode="create"
          relatedUsers={props.relatedUsers}
          projectId={props.projectId}
        />
      </div>
      <Tabs
        key={"md"}
        size={"md"}
        fullWidth
        aria-label="Tabs sizes"
        onSelectionChange={(key) => props.setFilterTask(Number(key))}
        selectedKey={props.filterTask.toString()}
      >
        {statusOptions.map((statusOption) => (
          <Tab key={statusOption.key} title={statusOption.value} />
        ))}
      </Tabs>
      <Table selectionMode="single">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={props.tasks} emptyContent={"No rows to display."}>
          {(item) => (
            <TableRow key={item.id} className="hover:cursor-pointer">
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
