"use client";

import { API_ENDPOINTS } from "@/libs/config";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import Link from "next/link";
import { formatDate, formatedTimeToMinutes, truncateText } from "@/app/util";
import { Divider } from "@nextui-org/divider";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { DeleteIcon } from "@/app/(dashboard)/technology/_components/Icons";
import { toast } from "sonner";
import { useInterviewContext } from "../_providers/InterviewProvider";
import { Spinner } from "@nextui-org/spinner";
import { Pagination } from "@nextui-org/pagination";

export default function InterViewCard() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedSchedule, setSelectedSchedule] = useState() as any;

  const {
    listInterviewData,
    refetchListInterview,
    isListInterviewLoading,
    setInterviewPageIndex,
  } = useInterviewContext() || {};

  const interViewData = listInterviewData?.interviews || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.interviewSchedule + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json()),

    onError: (error) => {},

    onSuccess: () => {
      toast.success("Schedule deleted successfully");

      (refetchListInterview as () => void)();
    },
  });

  const router = useRouter();

  const handlePress = (id: string) => {
    router.push(`interview/details/${id}`);
  };

  const openModalDelete = (id: any) => {
    onOpen();
    setSelectedSchedule(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);

    onClose();
  };

  return (
    <div>
      <div>
        {isListInterviewLoading ? (
          <Spinner className="flex items-center gap-4">Loading...</Spinner>
        ) : (
          <div className="grid h-fit grid-cols-3 gap-6">
            {" "}
            {interViewData &&
              interViewData.map((interview: any) => (
                <Card
                  key={interview.id as string}
                  className="h-fit w-full"
                  shadow="lg"
                  isPressable
                >
                  <CardHeader>
                    <div className="flex w-full items-center justify-between">
                      <div className="text-md mt-1 text-lg font-semibold">
                        {interview.title}
                      </div>
                      <button
                        className="bg-transparent"
                        onClick={() => openModalDelete(interview.id as string)}
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody
                    onClick={() => handlePress(interview.id)}
                    className="cursor-pointer rounded-lg border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    {/* Header Section */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Start date:
                        </span>
                        <span className="text-gray-600">
                          {formatDate(interview.interviewDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Start time:
                        </span>
                        <span className="text-gray-600">
                          {interview.startTime}
                        </span>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Interviewed by:
                        </span>
                        <span className="text-gray-600">
                          {interview.interviewer?.fullName || "N/A"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Duration:
                        </span>
                        <span className="text-gray-600">
                          {formatedTimeToMinutes(interview.timeDuration)} mins
                        </span>
                      </div>
                    </div>
                    <div className="mb-2 font-semibold">
                      Number of invitations :{" "}
                    </div>
                    {/* Invitation Status Section */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-blue-500">
                          {interview.numberOfNotYetInvitations}
                        </span>
                        <span className="text-sm text-gray-600">Not Yet</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-green-500">
                          {interview.numberOfConfirmedInvitations}
                        </span>
                        <span className="text-sm text-gray-600">Confirmed</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-yellow-500">
                          {interview.numberOfInvitationsReschedule}
                        </span>
                        <span className="text-sm text-gray-600">
                          Reschedule
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-red-500">
                          {interview.numberOfInvitationsDeclined}
                        </span>
                        <span className="text-sm text-gray-600">Declined</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        )}
        {listInterviewData?.totalPages ? (
          <div className="mt-4 flex justify-center">
            <Pagination
              isCompact
              loop
              showControls
              total={listInterviewData.totalPages}
              initialPage={listInterviewData.pageIndex}
              onChange={(page) => {
                setInterviewPageIndex(page);
              }}
            />
          </div>
        ) : (
          <></>
        )}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="max-w-fit"
        >
          <ModalContent>
            <ModalBody className="mt-5">
              Are you sure you want to delete?
              <div className="mt-5 grid grid-cols-2 gap-5">
                <Button
                  onClick={() => handleDelete(selectedSchedule)}
                  color="primary"
                >
                  Yes
                </Button>
                <Button onClick={onClose}>No</Button>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
