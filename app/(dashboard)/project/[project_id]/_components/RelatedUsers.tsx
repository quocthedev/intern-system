import React, { Key } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import NewMemberModal from "./NewMemberModal";
import MemberUpdate from "./MemberUpdate";
import MemberDeleteModal from "./MemberDeleteModal";

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
      case "actions":
        return (
          <div className="flex gap-1">
            <MemberUpdate
              projectName={props?.projectName as string}
              projectId={props?.projectId as string}
              memberName={item.fullName}
              memberId={item.id}
              role={item.role}
            />
            <MemberDeleteModal
              projectId={props?.projectId as string}
              memberId={item.id}
            />
          </div>
        );
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
      key: "actions",
      title: "Actions",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Members</h1>
        <NewMemberModal projectId={props?.projectId as string} />
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
