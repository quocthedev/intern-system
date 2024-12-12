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
} from "@/libs/_types/Candidate";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { PaginationResponseSuccess, PagingData } from "@/libs/types";
import { Pagination } from "@nextui-org/pagination";
import { Link } from "@nextui-org/link";
import { useToggle } from "usehooks-ts";
import { Tab, Tabs } from "@nextui-org/tabs";
import { DatePicker } from "@nextui-org/date-picker";

import { now, getLocalTimeZone, today } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { GetUsersByRoleResponse } from "../libs/_types/GetUsersResponse";
import { sendEmail } from "@/actions/send-email-next";
import { InterviewIcon } from "@/components/icons/ActionBarIcons";
import { toast } from "sonner";
import { isWeekend } from "date-fns";
import {
  CandidateStatus,
  UniversityCandidate,
  useUniversityCandidate,
} from "@/data-store/candidate/university-candidate";
import { Chip, ChipProps } from "@nextui-org/chip";
import { formatDate } from "@/app/util";
import { I18nProvider } from "@react-aria/i18n";

const apiClient = new APIClient({
  // onFulfilled: (response) => response,
  // onRejected: (error) => {
  //   return error;
  // },
});

const statusColorMap: Record<string, ChipProps["color"]> = {
  Approved: "success",
  InProgress: "warning",
  Rejected: "danger",
  InterviewEmailSent: "warning",
  InterviewResultEmailSent: "warning",
  CompletedOjt: "success",
};

export type InterviewScheduleModalProps = {
  candidates?: { id: string; fullName: string }[];
  isAddingCandidate?: boolean;
  universityId?: string;
  internPeriodId?: string;
  callback?: () => void;
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

  const {
    data: universityCandidateData,
    isLoading: isLoadinguniversityCandidateData,
  } = useUniversityCandidate({
    pageSize: 10,
    internPeriodId: props.internPeriodId,
    universityId: props.universityId,
    status: CandidateStatus.Approved,
  });

  let candidates: Candidate[] | UniversityCandidate[] | undefined;
  let totalPages: number | undefined;

  if (props.universityId) {
    candidates = universityCandidateData?.candidates;
    totalPages = universityCandidateData?.totalPages;
  } else {
    candidates = getCandidateData?.pagingData;
    totalPages = getCandidateData?.totalPages;
  }

  const columns = [
    {
      key: "fullName",
      title: "Name",
    },
    // {
    //   key: "group",
    //   title: "Group",
    // },
    {
      key: "doB",
      title: "Date of Birth",
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
    },
    {
      key: "universityEmail",
      title: "University Email",
    },
    {
      key: "cv",
      title: "CV",
    },
    {
      key: "gpa",
      title: "GPA",
    },
    // {
    //   key: "university",
    //   title: "University",
    // },
    {
      key: "status",
      title: "Status",
    },
  ];

  const renderCell = (
    item: Candidate | UniversityCandidate,
    columnKey: string,
  ) => {
    switch (columnKey) {
      case "fullName":
        return item.fullName;
      // case "group":
      //   return item.internPeriodViewModel.name;
      case "doB":
        return formatDate(item.doB.split("T")[0]);
      case "phoneNumber":
        return item.phoneNumber;

      case "universityEmail":
        return item.universityEmail;

      case "cv":
        return <Link href={item.cvUri}>Link</Link>;

      case "gpa":
        return item.gpa;

      // case "university":
      //   return item.universityViewModel.name;

      case "status":
        return (
          <Chip color={statusColorMap[item.status]} variant="flat">
            {item.status}
          </Chip>
        );

      default:
        return "";
    }
  };

  const durations = [
    {
      key: "0",
      name: "15 min",
      value: "00:15",
    },
    {
      key: "1",
      name: "30 min",
      value: "00:30",
    },
    {
      key: "2",
      name: "45 min",
      value: "00:45",
    },
    {
      key: "3",
      name: "60 min",
      value: "01:00",
    },
  ];

  return (
    <>
      <Button
        onPress={() => {
          console.log(props.candidates);
          if (!props.isAddingCandidate) {
            if (props.candidates?.length === 0) {
              toast.warning(
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
                      try {
                        await sendEmail(formData);

                        toast.success("Interview email send successfully! 🎉");
                      } catch (e) {
                        console.log(e);

                        toast.error("Failed to send email! 😢");
                      }

                      if (props.callback) {
                        props.callback();
                      }

                      onClose();
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <p>
                        To:{" "}
                        {(props.candidates
                          ? props.candidates.map((student) => {
                              student.fullName;
                            })
                          : Array.from(selectedKeys).map((key) => {
                              const candidate = candidates?.find(
                                (c) => c.id === key,
                              );

                              return candidate
                                ? `${candidate.fullName} <${candidate.universityEmail}>`
                                : null;
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
                      <I18nProvider locale="vi-VN">
                        {/* get viet name calendar */}
                        <DatePicker
                          label="Interview Date"
                          // variant="bordered"
                          hideTimeZone
                          showMonthAndYearPickers
                          defaultValue={now(getLocalTimeZone())}
                          name="dateTime"
                          labelPlacement="outside"
                          isRequired
                          isDateUnavailable={isWeekend as any}
                        />
                      </I18nProvider>

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
                      {isLoading ? "Sending..." : "Schedule Interview"}
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
