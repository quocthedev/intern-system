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
import { useProjectDetailContext } from "../../_providers/ProjectDetailProvider";
import Loading from "@/components/Loading";
import { getCookie } from "@/app/util";

type RelatedUser = {
  id: string;
  name: string;
  role: string;
};
export default function RelatedUsers() {
  const { projectSummary, isLoadingProjectSummary } = useProjectDetailContext();
  const role = getCookie("userRole");

  const relatedUser = projectSummary?.groupUserRelated.reduce((acc, group) => {
    const usersWithRole = group.users.map((user) => ({
      ...user,
      name: user.fullName,
      role: group.role,
      id: user.id, // Ensure id is a number
    }));

    return [...acc, ...usersWithRole];
  }, [] as RelatedUser[]);

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
      case "actions":
        if (role === "Administrator" || role === "Mentor") {
          return (
            <div className="flex gap-1">
              <MemberUpdate
                projectName={projectSummary?.title as string}
                projectId={projectSummary?.id as string}
                memberName={item.name}
                memberId={item.id}
                role={item.role}
              />
              <MemberDeleteModal
                projectId={projectSummary?.id as string}
                memberId={item.id}
              />
            </div>
          );
        }

        return null;
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
    {
      key: "actions",
      title: "Actions",
    },
  ];

  if (isLoadingProjectSummary) {
    return <Loading />;
  }

  return (
    <div className="mt-2 flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Members</h1>
        {role === "Administrator" || role === "Mentor" ? (
          <NewMemberModal projectId={projectSummary?.id as string} />
        ) : (
          <></>
        )}
      </div>

      <Table className="max-h-[300px]" isHeaderSticky>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.title}</TableColumn>
          )}
        </TableHeader>

        <TableBody items={relatedUser ?? []} className="overflow-hidden">
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
