import { Button } from "@nextui-org/button";
import { DatePicker } from "@nextui-org/date-picker";
import { Input, Textarea } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import React, { useState } from "react";
import { getLocalTimeZone, now, parseDate } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { createNewTask } from "@/actions/create-new-task";
import { updateTask } from "@/actions/update-task";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import APIClient from "@/libs/api-client";
import { useParams } from "next/navigation";
import { ProjectTask } from "@/data-store/project/project-task.store";
import { useProjectDetailContext } from "../../_providers/ProjectDetailProvider";
import { AddIcon, EditIcon } from "@/app/(dashboard)/project/_components/Icons";
import { getCookie } from "@/app/util";

export type TaskModalProps = {
  mode: "create" | "edit";
  selectedTaskInfo?: ProjectTask;
  projectId: string;
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

const role = getCookie("userRole");

export type User = {
  id: string;
};

export default function TaskModal(props: TaskModalProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedPositionId, setSelectedPositionId] = useState(
    props.selectedTaskInfo?.typeTask.id as string,
  );
  const [selectedPositionTaskId, setSelectedPositionTaskId] = useState("");

  const { project_id } = useParams();

  const { projectSummary, refetchProjectTask } = useProjectDetailContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userPositions", selectedPositionId],

    queryFn: async () => {
      const response = (await apiClient.get(
        `/project/${project_id}/position/${selectedPositionId}/user-relates`,
      )) as { statusCode: string; data: any };

      if (response.statusCode == "200") {
        return response.data;
      }
    },
    enabled: !!selectedPositionId,
  });

  const handleClose = () => {
    onClose();
  };

  const priorityOptions = [
    {
      key: "0",
      value: "Highest",
    },
    {
      key: "1",
      value: "High",
    },
    {
      key: "2",
      value: "Medium",
    },
    {
      key: "3",
      value: "Low",
    },
    {
      key: "4",
      value: "Lowest",
    },
  ];

  const difficultyOptions = [
    {
      key: "1",
      value: "Easy",
    },
    {
      key: "2",
      value: "MediumEasy",
    },
    {
      key: "3",
      value: "Medium",
    },
    {
      key: "4",
      value: "MediumHard",
    },
    {
      key: "5",
      value: "Hard",
    },
  ];

  const statusOptions = [
    {
      key: "0",
      value: "NotStarted",
    },
    {
      key: "1",
      value: "InProgress",
    },
    {
      key: "2",
      value: "InReview",
    },
    {
      key: "3",
      value: "Done",
    },
    // {
    //   key: "4",
    //   value: "OverDue",
    // },
  ];

  const submitTask = async (formData: FormData) => {
    formData.append(
      "priority",
      priorityOptions.find(
        (priority) => priority.value === props.selectedTaskInfo?.priority,
      )?.key ?? "0",
    );
    formData.append(
      "difficulty",
      difficultyOptions.find(
        (difficulty) =>
          String(difficulty.value) ===
          String(props.selectedTaskInfo?.difficulty),
      )?.key ?? "1",
    );

    formData.append(
      "priority",
      priorityOptions.find(
        (priority) => priority.value === props.selectedTaskInfo?.priority,
      )?.key ?? "0",
    );
    formData.append("projectId", props.projectId);
    formData.append("positionId", selectedPositionId);
    formData.append(
      "status",
      statusOptions.find(
        (status) => status.value === props.selectedTaskInfo?.status,
      )?.key ?? "0",
    );

    if (props.mode === "edit") {
      formData.append("taskId", props.selectedTaskInfo?.id as string);

      const userId = formData.get("userId") as string;

      if (!userId) {
        formData.append(
          "userId",
          props.selectedTaskInfo?.assignedPerson.id as string,
        );
      }

      const res = (await updateTask(formData)) as any;

      if (res?.error) {
        toast.error(res.error);

        return;
      }

      toast.success("Task updated successfully!");
    } else {
      const res = (await createNewTask(formData)) as any;

      if (res?.error) {
        toast.error(res.error);

        return;
      }

      toast.success("Task created successfully!");
    }

    onClose();
    refetchProjectTask();
  };

  return (
    <>
      {props.mode === "edit" ? (
        <Button onPress={onOpen} isIconOnly variant="light">
          <EditIcon />
        </Button>
      ) : (
        <Button onPress={onOpen} color="primary" variant="shadow">
          <AddIcon /> Create New Task
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-[800px]">
        <ModalContent className="max-w-[600px]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>
                  {props.mode === "edit" ? "Update Task" : "Add New Task"}
                </h1>
              </ModalHeader>

              <ModalBody className="">
                <form className="flex flex-col gap-4" action={submitTask}>
                  {
                    // Only show status select for edit mode
                    props.mode === "edit" && (
                      <Select
                        label="Status"
                        labelPlacement="outside"
                        isDisabled={role === "Candidate"}
                        defaultSelectedKeys={[
                          statusOptions.find(
                            (status) =>
                              status.value === props.selectedTaskInfo?.status,
                          )?.key ?? "0",
                        ]}
                        name="status"
                      >
                        {statusOptions.map((status) => (
                          <SelectItem key={status.key}>
                            {status.value}
                          </SelectItem>
                        ))}
                      </Select>
                    )
                  }
                  <Input
                    type="text"
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Enter Task Title"
                    isRequired
                    name="title"
                    readOnly={role === "Candidate"}
                    defaultValue={props.selectedTaskInfo?.title}
                  />
                  <Textarea
                    type="text"
                    label="Summary"
                    labelPlacement="outside"
                    placeholder="Enter Task Summary"
                    readOnly={role === "Candidate"}
                    isRequired
                    minRows={2}
                    name="summary"
                    defaultValue={props.selectedTaskInfo?.summary}
                  />

                  <div className="flex w-full gap-3">
                    <DatePicker
                      label="Start date"
                      labelPlacement="outside"
                      name="startDate"
                      isRequired
                      granularity="day"
                      isReadOnly={role === "Candidate"}
                      defaultValue={
                        props.mode === "create"
                          ? now(getLocalTimeZone())
                          : parseDate(
                              props.selectedTaskInfo?.startDate.split(
                                "T",
                              )[0] as string,
                            )
                      }
                    />

                    <DatePicker
                      label="Due date"
                      labelPlacement="outside"
                      name="dueDate"
                      isRequired
                      showMonthAndYearPickers
                      granularity="day"
                      isReadOnly={role === "Candidate"}
                      defaultValue={
                        props.mode === "create"
                          ? now(getLocalTimeZone())
                          : parseDate(
                              props.selectedTaskInfo?.dueDate.split(
                                "T",
                              )[0] as string,
                            )
                      }
                    />
                  </div>

                  <div className="flex w-full gap-3">
                    <Select
                      isDisabled={role === "Candidate"}
                      label="Priority"
                      labelPlacement="outside"
                      defaultSelectedKeys={[
                        priorityOptions.find(
                          (priority) =>
                            priority.value === props.selectedTaskInfo?.priority,
                        )?.key ?? "0",
                      ]}
                      name="priority"
                    >
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.key}>
                          {priority.value}
                        </SelectItem>
                      ))}
                    </Select>

                    <Select
                      label="Difficulty"
                      labelPlacement="outside"
                      isDisabled={role === "Candidate"}
                      defaultSelectedKeys={[
                        difficultyOptions.find(
                          (difficulty) =>
                            String(difficulty.value) ===
                            String(props.selectedTaskInfo?.difficulty),
                        )?.key ?? "1",
                      ]}
                      name="difficulty"
                    >
                      {difficultyOptions.map((difficulty) => (
                        <SelectItem key={difficulty.key}>
                          {difficulty.value}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {props.mode === "edit" && (
                      <>
                        <Input
                          type="number"
                          label="Completion Progress"
                          labelPlacement="outside"
                          placeholder="Enter Completion Progress (0-100)"
                          name="completionProgress"
                          min={0}
                          max={100}
                          defaultValue={props.selectedTaskInfo?.completionProgress?.toString()}
                        />

                        <Input
                          type="number"
                          label="Progress Assessment"
                          labelPlacement="outside"
                          placeholder="Enter Progress Assessment"
                          name="progressAssessment"
                          isReadOnly={role === "Candidate"}
                          min={0}
                          max={100}
                          defaultValue={props.selectedTaskInfo?.progressAssessment?.toString()}
                        />
                      </>
                    )}
                  </div>
                  <div>
                    <div className="-mt-2 grid grid-cols-2 gap-2">
                      <Select
                        label="Select position"
                        labelPlacement="outside"
                        placeholder="Select position"
                        isDisabled={role === "Candidate"}
                        defaultSelectedKeys={[
                          props.selectedTaskInfo?.typeTask.id || "",
                        ]}
                        name="positionId"
                        onChange={(e) => setSelectedPositionId(e.target.value)}
                      >
                        {(projectSummary?.listPosition ?? []).map(
                          (position) => (
                            <SelectItem key={position.id} value={position.id}>
                              {position.name}
                            </SelectItem>
                          ),
                        )}
                      </Select>

                      <Select
                        label="Assignee"
                        labelPlacement="outside"
                        placeholder="Select Assignee"
                        isDisabled={role === "Candidate"}
                        defaultSelectedKeys={[
                          props.selectedTaskInfo?.assignedPerson.id || "",
                        ]}
                        name="userId"
                        required
                        isLoading={isLoading}
                      >
                        {data?.map((user: any) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.fullName}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button color="primary" fullWidth type="submit">
                      Submit
                    </Button>
                    <Button fullWidth onPress={handleClose}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
