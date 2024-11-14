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

export type TaskModalProps = {
  mode: "create" | "edit";
  selectedTaskInfo?: any;
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
      key: "1",
      value: "1",
    },
    {
      key: "2",
      value: "2",
    },
    {
      key: "3",
      value: "3",
    },
    {
      key: "4",
      value: "4",
    },
    {
      key: "5",
      value: "5",
    },
  ];

  const submitTask = async (formData: FormData) => {
    formData.append("projectId", props.projectId);

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
  };

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="shadow">
        Add Task
      </Button>
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
                  />
                  <Input
                    type="text"
                    label="Summary"
                    labelPlacement="outside"
                    placeholder="Enter Task Summary"
                    isRequired
                    name="summary"
                  />

                  <Textarea
                    type="text"
                    label="Description"
                    labelPlacement="outside"
                    placeholder="Enter Task Description"
                    minRows={3}
                    isRequired
                    name="description"
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
                              props.selectedTaskInfo?.releaseDate.split(
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
                        props.mode === "create"
                          ? "4"
                          : props.selectedTaskInfo.priority,
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
                        props.mode === "create"
                          ? "1"
                          : props.selectedTaskInfo.difficulty,
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
                    defaultSelectedKeys={[]}
                    placeholder="Select assignee"
                    name="userId"
                  >
                    {(props.relatedUsers ?? []).map((user) => (
                      <SelectItem key={user.id}>{user.fullName}</SelectItem>
                    ))}
                  </Select>

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
