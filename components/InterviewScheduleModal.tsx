"use client";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useQuery } from "@tanstack/react-query";
import React, { Key } from "react";
import {
  Candidate,
  GetCandidatePaginationResponse,
} from "../app/(dashboard)/interview-schedule/_types/Candidate";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { PaginationResponseSuccess, PagingData } from "@/libs/types";
import { Pagination } from "@nextui-org/pagination";
import { Link } from "@nextui-org/link";
import { useToggle } from "usehooks-ts";
import { Tab, Tabs } from "@nextui-org/tabs";
import { DatePicker } from "@nextui-org/date-picker";

import { now, getLocalTimeZone } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { GetUsersByRoleResponse } from "../app/(dashboard)/interview-schedule/_types/GetUsersResponse";
import { sendEmail } from "@/actions/send-email-next";
import { InterviewIcon } from "@/components/icons/ActionBarIcons";

const apiClient = new APIClient({
  // onFulfilled: (response) => response,
  // onRejected: (error) => {
  //   return error;
  // },
});

export type InterviewScheduleModalProps = {
  candidates?: { id: string; fullName: string }[];
  isAddingCandidate?: boolean;
};

export default function InterviewScheduleModal(
  props: InterviewScheduleModalProps,
) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showSubmissionForm, toggleShowSubmissionForm, setShowSubmissionForm] =
    useToggle(false);

  const [interviewFormat, setInterviewFormat] = React.useState("0");

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [duration, setDuration] = React.useState("00:30");

  const [pageIndex, setPageIndex] = React.useState(1);

  const {
    data: getCandidateData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["members", pageIndex],
    queryFn: async () => {
      const response = (await apiClient.get<GetCandidatePaginationResponse>(
        API_ENDPOINTS.candidate,
        {
          params: {
            pageIndex: pageIndex,
            pageSize: 10,
          },
        },
      )) as PaginationResponseSuccess<Candidate>;

      return response.data;
    },
  });

  const {
    data: mentors,
    isLoading: isLoadingMentors,
    error: errorMentors,
  } = useQuery({
    queryKey: ["mentors", pageIndex],
    queryFn: async () => {
      const response = await apiClient.get<GetUsersByRoleResponse>(
        `${API_ENDPOINTS.user}/aee16c2e-7255-4c1a-9084-d34143f9bc2d/users`,
        {
          params: {
            pageIndex: pageIndex,
            pageSize: 10,
          },
        },
        true,
      );

      return response.data.users;
    },
  });

  const { pagingData: candidates, totalPages } = getCandidateData || {};

  const columns = [
    {
      key: "fullName",
      title: "Name",
    },
    {
      key: "group",
      title: "Group",
    },
    {
      key: "doB",
      title: "Date of Birth",
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "cv",
      title: "CV",
    },
    {
      key: "gpa",
      title: "GPA",
    },
    {
      key: "university",
      title: "University",
    },
    {
      key: "status",
      title: "Status",
    },
  ];

  const renderCell = (item: Candidate, columnKey: string) => {
    switch (columnKey) {
      case "fullName":
        return item.fullName;
      case "group":
        return item.internPeriodViewModel.name;
      case "doB":
        return item.doB.split("T")[0];
      case "phoneNumber":
        return item.phoneNumber;

      case "email":
        return item.universityEmail;

      case "cv":
        return <Link href={item.cvUri}>Link</Link>;

      case "gpa":
        return item.gpa;

      case "university":
        return item.universityViewModel.name;

      case "status":
        return item.status;

      default:
        return "";
    }
  };

  const durations = [
    {
      key: "0",
      name: "30 min",
      value: "00:30",
    },
    {
      key: "1",
      name: "60 min",
      value: "01:00",
    },
    {
      key: "2",
      name: "90 min",
      value: "01:30",
    },
    {
      key: "3",
      name: "120 min",
      value: "02:00",
    },
  ];

  return (
    <>
      <Button
        onPress={() => {
          console.log(props.candidates);
          if (!props.isAddingCandidate) {
            if (props.candidates?.length === 0) {
              console.log("test");
              alert(
                "Please select at least one candidate to schedule interview",
              );
            } else {
              onOpen();
            }
          } else onOpen();
        }}
        color="primary"
        variant="shadow"
        startContent={<InterviewIcon />}
        className="px-6"
      >
        Schedule Interview
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setShowSubmissionForm(false);
          setSelectedKeys(new Set([]));
          onOpenChange();
        }}
      >
        <ModalContent className="max-w-fit">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">
                  {showSubmissionForm
                    ? "Schedule Interview"
                    : "Select members to schedule interview"}
                </h1>
              </ModalHeader>

              <ModalBody className="mb-3">
                {showSubmissionForm || !props.isAddingCandidate ? (
                  <form
                    className="flex w-[600px] flex-col gap-4"
                    action={async (formData: FormData) => {
                      formData.append(
                        "recipients",
                        (props.candidates
                          ? props.candidates.map((student) => student.id)
                          : Array.from(selectedKeys)
                        ).join(","),
                      );
                      formData.append("duration", duration);
                      await sendEmail(formData);

                      onClose();
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <p>
                        To:{" "}
                        {(props.candidates
                          ? props.candidates.map((student) => student.fullName)
                          : Array.from(selectedKeys).map((key) => {
                              const candidate = candidates?.find(
                                (c) => c.id === key,
                              );

                              return candidate?.fullName;
                            })
                        ).join(", ")}
                      </p>

                      {props.isAddingCandidate && (
                        <Button
                          color="primary"
                          variant="ghost"
                          onPress={toggleShowSubmissionForm}
                        >
                          + Add candidate
                        </Button>
                      )}
                    </div>

                    <Input
                      label="Title"
                      placeholder="e.g. Interview with Tech Lead"
                      labelPlacement="outside"
                      name="subject"
                      required
                    />

                    <div className="flex flex-col">
                      <p>Duration</p>
                      <Tabs
                        items={durations}
                        variant="light"
                        color="primary"
                        onSelectionChange={
                          ((key: Key) => {
                            setDuration(
                              durations.find((item) => item.key === key)
                                ?.value || "00:30",
                            );
                          }) as any
                        }
                      >
                        {(item) => (
                          <Tab
                            key={item.key}
                            value={item.key}
                            title={item.name}
                          />
                        )}
                      </Tabs>
                    </div>

                    <div className="flex gap-3">
                      <DatePicker
                        label="Interview Date"
                        // variant="bordered"
                        hideTimeZone
                        showMonthAndYearPickers
                        defaultValue={now(getLocalTimeZone())}
                        name="dateTime"
                        labelPlacement="outside"
                        isRequired
                      />

                      <Select
                        label="Interview Format"
                        placeholder="Select format"
                        labelPlacement="outside"
                        name="format"
                        items={[
                          {
                            key: "0",
                            name: "Online",
                          },
                          {
                            key: "1",
                            name: "Offline",
                          },
                        ]}
                        defaultSelectedKeys={
                          [interviewFormat] as unknown as string[]
                        }
                        onChange={(key) => {
                          setInterviewFormat(key.target.value as string);
                        }}
                        selectedKeys={[interviewFormat]}
                        required
                      >
                        {(item) => (
                          <SelectItem key={item.key}>{item.name}</SelectItem>
                        )}
                      </Select>
                    </div>

                    <Input
                      label={interviewFormat == "0" ? "Meeting URL" : "Address"}
                      placeholder={
                        interviewFormat == "0"
                          ? "https://meet.google.com/abc-xyz"
                          : "123 Street, City, Country"
                      }
                      labelPlacement="outside"
                      name="location"
                      required
                    />
                    <Select
                      label="Interviewer"
                      placeholder="Select interviewer"
                      labelPlacement="outside"
                      items={mentors || []}
                      name="interviewer"
                      required
                    >
                      {(item) => (
                        <SelectItem key={item.id}>{item.fullName}</SelectItem>
                      )}
                    </Select>

                    <Button
                      color="primary"
                      variant="shadow"
                      fullWidth
                      type="submit"
                    >
                      Schedule Interview
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex w-full gap-3">
                        <Input
                          type="text"
                          label="Search by member name"
                          size="sm"
                        />

                        <Button
                          color="primary"
                          variant="shadow"
                          size="lg"
                          onPress={toggleShowSubmissionForm}
                        >
                          Continue
                        </Button>
                      </div>

                      <Table
                        fullWidth
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        onSelectionChange={(selectedKeys) => {
                          setSelectedKeys(selectedKeys as Set<never>);
                        }}
                        className="max-h-[300px]"
                        isHeaderSticky
                      >
                        <TableHeader columns={columns}>
                          {(column) => (
                            <TableColumn key={column.key}>
                              {column.title}
                            </TableColumn>
                          )}
                        </TableHeader>

                        <TableBody className="">
                          {(candidates || []).map((candidate) => (
                            <TableRow key={candidate.id}>
                              {(columnKey) => (
                                <TableCell>
                                  {renderCell(candidate, columnKey.toString())}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <Pagination
                        isCompact
                        loop
                        showControls
                        total={Number(totalPages || candidates?.length || 1)}
                        initialPage={1}
                        onChange={setPageIndex}
                      />
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
