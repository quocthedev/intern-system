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
import React from "react";
import { getLocalTimeZone, now, parseDate } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { RelatedUser } from "../page";
import { createNewTask } from "@/actions/create-new-task";
import { EditIcon } from "../../_components/Icons";
import { Task } from "../../_types/Project";
import { updateTask } from "@/actions/update-task";

export type TaskModalProps = {
  mode: "create" | "edit";
  selectedTaskInfo?: Task;
  relatedUsers?: RelatedUser[];
  projectId: string;
};

export default function TaskModal(props: TaskModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
      key: "0",
      value: "Easy",
    },
    {
      key: "1",
      value: "MediumEasy",
    },
    {
      key: "2",
      value: "Medium",
    },
    {
      key: "3",
      value: "MediumHard",
    },
    {
      key: "4",
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
    {
      key: "4",
      value: "OverDue",
    },
  ];

  const submitTask = async (formData: FormData) => {
    formData.append("projectId", props.projectId);

    if (props.mode === "edit") {
      formData.append("taskId", props.selectedTaskInfo?.id as string);

      await updateTask(formData);
    } else {
      // Make sure due date is after start date
      const startDate = new Date(
        formData.get("startDate")?.toString().split("T")[0] as string,
      ).getTime();
      const dueDate = new Date(
        formData.get("dueDate")?.toString().split("T")[0] as string,
      ).getTime();

      // Make sure start date is not in the past
      if (startDate < Date.now()) {
        alert("Start date must be in the future");
        return;
      }

      if (startDate >= dueDate) {
        alert("Due date must be after start date");
        return;
      }

      await createNewTask(formData);
    }
  };

  console.log(props.selectedTaskInfo?.memberId);

  return (
    <>
      {props.mode === "edit" ? (
        <Button onClick={onOpen} isIconOnly variant="light">
          <EditIcon />
        </Button>
      ) : (
        <Button onPress={onOpen} color="primary" variant="shadow">
          Add Task
        </Button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-[800px]">
        <ModalContent className="max-w-[600px]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Add New Task</h1>
              </ModalHeader>

              <ModalBody className="">
                <form className="flex flex-col gap-4" action={submitTask}>
                  <Input
                    type="text"
                    label="Title"
                    labelPlacement="outside"
                    placeholder="Enter Task Title"
                    isRequired
                    name="title"
                    defaultValue={props.selectedTaskInfo?.title}
                  />
                  <Input
                    type="text"
                    label="Summary"
                    labelPlacement="outside"
                    placeholder="Enter Task Summary"
                    isRequired
                    name="summary"
                    defaultValue={props.selectedTaskInfo?.summary}
                  />

                  <Textarea
                    type="text"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter Task Description"
                    minRows={3}
                    maxRows={5}
                    isRequired
                    name="description"
                    defaultValue={props.selectedTaskInfo?.description}
                  />

                  <div className="flex w-full gap-3">
                    <DatePicker
                      label="Start date"
                      labelPlacement="outside"
                      name="startDate"
                      isRequired
                      granularity="day"
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
                      defaultSelectedKeys={[
                        difficultyOptions.find(
                          (difficulty) =>
                            Number(difficulty.value) ===
                            props.selectedTaskInfo?.difficulty,
                        )?.key ?? "0",
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
                  <Select
                    label="Assignee"
                    labelPlacement="outside"
                    placeholder={"Select Assignee"}
                    defaultSelectedKeys={[
                      `${props.selectedTaskInfo?.memberId ?? ""}`,
                    ]}
                    name="userId"
                    required
                  >
                    {(props.relatedUsers ?? []).map((user) => (
                      <SelectItem key={user.id}>{user.fullName}</SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    type="text"
                    label="Notes"
                    labelPlacement="outside"
                    placeholder="Enter Task Notes"
                    minRows={1}
                    maxRows={2}
                    // isRequired
                    name="note"
                    // defaultValue={props.selectedTaskInfo?.description}
                  />

                  {
                    // Only show status select for edit mode
                    props.mode === "edit" && (
                      <Select
                        label="Status"
                        labelPlacement="outside"
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

                  <Button color="primary" fullWidth type="submit">
                    Submit
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
