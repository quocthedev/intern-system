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
import React, { Key } from "react";
import APIClient from "@/libs/api-client";
import { useToggle } from "usehooks-ts";
import { Tab, Tabs } from "@nextui-org/tabs";
import { DatePicker } from "@nextui-org/date-picker";

import { now, getLocalTimeZone } from "@internationalized/date";
import { Select, SelectItem } from "@nextui-org/select";
import { sendEmail } from "@/actions/send-email-next";
import { InterviewIcon } from "@/components/icons/ActionBarIcons";
import { toast } from "sonner";
import { isWeekend } from "date-fns";
import { ChipProps } from "@nextui-org/chip";
import { I18nProvider } from "@react-aria/i18n";
import { useInterviewDetailContext } from "@/app/(dashboard)/interview/_providers/InterviewDetailProvider";
import Loading from "@/components/Loading";

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
  disabled?: boolean;
};
export default function InterviewRescheduleModal(
  props: InterviewScheduleModalProps,
) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showSubmissionForm, toggleShowSubmissionForm, setShowSubmissionForm] =
    useToggle(false);

  const [interviewFormat, setInterviewFormat] = React.useState("0");

  const [duration, setDuration] = React.useState("00:30");

  const { rescheduleDetailData, isRescheduleDetailLoading } =
    useInterviewDetailContext();

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
        color="secondary"
        variant="shadow"
        startContent={<InterviewIcon />}
        className="px-6"
        isDisabled={props.disabled}
      >
        Reschedule interview
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setShowSubmissionForm(false);
          onOpenChange();
        }}
      >
        <ModalContent className="max-w-fit">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Reschedule Interview</h1>
              </ModalHeader>

              <ModalBody className="mb-3">
                <form
                  className="flex w-[600px] flex-col gap-4"
                  action={async (formData: FormData) => {
                    formData.append(
                      "recipients",
                      (rescheduleDetailData?.interviewScheduleDetails || [])
                        .map((detail) => detail.candidateId)
                        .join(","),
                    );
                    formData.append(
                      "interviewer",
                      rescheduleDetailData?.interviewerId || "",
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
                      {isRescheduleDetailLoading ? (
                        <Loading />
                      ) : (
                        rescheduleDetailData?.interviewScheduleDetails.map(
                          (detail) => (
                            <span key={detail.candidateId}>
                              {detail.candidateName} {"<"}
                              {detail.candidateUniversityEmail}
                              {">"}
                            </span>
                          ),
                        )
                      )}
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
                            durations.find((item) => item.key === key)?.value ||
                              "00:30",
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

                  <Button
                    color="primary"
                    variant="shadow"
                    fullWidth
                    type="submit"
                  >
                    {"Schedule Interview"}
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
