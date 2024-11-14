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

export type TaskListProps = {
  tasks: Task[];
  relatedUsers: RelatedUser[];
  projectId: string;
  className?: string;
};

export default function TaskList(props: TaskListProps) {
  const columns = [
    { key: "title", label: "Title" },
    { key: "summary", label: "Summary" },
    { key: "description", label: "Description" },
    { key: "startDate", label: "Start Date" },
    { key: "dueDate", label: "Due Date" },

    { key: "priority", label: "Priority" },
    { key: "difficulty", label: "Difficulty" },
    { key: "status", label: "Status" },
    { key: "memberName", label: "Member Name" },
  ];

  const renderCell = (item: Task, columnKey: Key) => {
    switch (columnKey) {
      case "title":
        return item.title;
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
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={props.tasks}>
          {(item) => (
            <TableRow key={item.id}>
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
