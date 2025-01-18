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
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { getCookie } from "@/app/util";

export default function TaskList() {
  const {
    projectTasks,
    isLoadingProjectTask,
    setProjectTaskPageIndex,
    setProjectTaskFilter,
    projectTaskFilter,
    projectSummary,
    removeAllProjectTaskFilter,
  } = useProjectDetailContext();
  const role = getCookie("userRole");

  const statusColorMap: Record<string, ChipProps["color"]> = {
    NotStarted: "default",
    InProgress: "warning",
    InReview: "secondary",
    Done: "success",
    OverDue: "danger",
  };

  const textColorMap: Record<string, string> = {
    Easy: "text-green-600",
    MediumEasy: "text-green-600",
    Medium: "text-yellow-600",
    MediumHard: "text-yellow-600",
    Hard: "text-red-600",
    Highest: "text-red-600",
    High: "text-yellow-600",
    Low: "text-green-600",
    Lowest: "text-green-600",
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
    { key: "all", value: "All" },
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
        return item.title;

      case "summary":
        return (
          <div>
            {item.summary ? (
              <Popover placement="top" showArrow offset={10}>
                <PopoverTrigger>
                  <Chip>View</Chip>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-base">{item.summary}</div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <></>
            )}
          </div>
        );

      case "startDate":
        return item.startDate.split("T")[0];
      case "dueDate":
        return item.dueDate.split("T")[0];
      case "priority":
        return (
          <div className={textColorMap[item.priority]}>{item.priority}</div>
        );
      case "difficulty":
        return (
          <div className={textColorMap[item.difficulty]}>{item.difficulty}</div>
        );
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
        return item.typeTask.name;
      case "completionProgress":
        return <div>{item.completionProgress}%</div>;
      case "progressAssessment":
        return item.progressAssessment;
      case "actions":
        return (
          <div className="flex">
            {projectTaskFilter?.Status === "3" ||
            projectTaskFilter?.Status === "4" ? (
              <></>
            ) : (
              <TaskModal
                mode="edit"
                projectId={projectSummary?.id as string}
                selectedTaskInfo={item}
              />
            )}

            {role === "Candidate" ||
            projectTaskFilter?.Status === "1" ||
            projectTaskFilter?.Status === "2" ||
            projectTaskFilter?.Status === "3" ? (
              <></>
            ) : (
              <TaskDeleteModal taskId={item.id} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Task List </p>

        {role === "Administrator" || role === "Mentor" ? (
          <TaskModal mode="create" projectId={projectSummary?.id as string} />
        ) : (
          <></>
        )}
      </div>

      <Tabs
        key={"md"}
        size={"md"}
        color="primary"
        fullWidth
        aria-label="Tabs sizes"
        onSelectionChange={(key) => {
          if (key === "all") {
            removeAllProjectTaskFilter();
          } else
            setProjectTaskFilter(
              Object.assign({}, projectTaskFilter, {
                Status: key as string,
              }),
            );
        }}
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
              column.key == "progressAssessment"
            ) {
              return false;
            }
            // if (
            //   (projectTaskFilter?.Status === "3" ||
            //     projectTaskFilter?.Status === "4") &&
            //   column.key == "actions"
            // ) {
            //   return false;
            // }
            // if (!projectTaskFilter?.Status && column.key === "actions") {
            //   return false;
            // } else {
            return true;
            // }
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
                    column.key === "progressAssessment"
                  ) {
                    return false;
                    // } else if (
                    //   (projectTaskFilter?.Status === "3" ||
                    //     projectTaskFilter?.Status === "4") &&
                    //   column.key === "actions"
                    // ) {
                    //   return false;
                  }
                  // if (!projectTaskFilter?.Status && column.key === "actions") {
                  //   return false;
                  // }

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

      {projectTasks ? (
        <Pagination
          className="m-4 flex justify-center"
          isCompact
          loop
          showControls
          total={
            projectTasks?.totalPages ? Number(projectTasks?.totalPages) : 0
          }
          initialPage={
            projectTasks?.pageIndex ? Number(projectTasks?.pageIndex) : 1
          }
          onChange={(page) => {
            setProjectTaskPageIndex(page);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
