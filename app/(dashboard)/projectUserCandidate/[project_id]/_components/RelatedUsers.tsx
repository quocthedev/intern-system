import React, { Key } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";

export type RelatedUsersProps = {
  groups: RelatedUser[];
  projectId: string;
  projectName: string;
};

type RelatedUser = {
  id: number;
  name: string;
  role: string;
};
export default function RelatedUsers(props?: RelatedUsersProps) {
  const renderCell = (item: any, columnKey: Key) => {
    switch (columnKey) {
      case "name":
        return <p className="text-sm">{item.fullName}</p>;
      case "role":
        return <p className="text-sm">{item.role}</p>;
      case "position":
        return <p className="text-sm">{item.position}</p>;
      case "totalTasks":
        return <p className="text-sm">{item.totalTask}</p>;
      case "completedTasks":
        return <p className="text-sm">{item.totalTaskComplete}</p>;
      default:
        return null;
    }
  };

  const columns = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "role",
      title: "Role",
    },
    {
      key: "position",
      title: "Position",
    },
    {
      key: "totalTasks",
      title: "Total Tasks",
    },
    {
      key: "completedTasks",
      title: "Completed Tasks",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Members</h1>
      </div>

      <Table className="max-h-[300px]" isHeaderSticky>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.title}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={props?.groups} className="overflow-hidden">
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
