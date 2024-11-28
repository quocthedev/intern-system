"use client";

import { API_ENDPOINTS } from "@/libs/config";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Pagination } from "@nextui-org/pagination";
import Link from "next/link";
import { formatedDate, formatedTimeToMinutes } from "@/app/util";
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

interface InterViewScheduleInterface {
  id: string;
  title: string;
  interviewDate: string;
  startTime: string;
  timeDuration: string;
  interviewFormat: string;
  interviewLocation: string;
  createdByUserId: string;
  interviewerId: string;
  createdByUser: any;
  interviewer: any;
}

export default function InterViewCard() {
  const [pageIndex, setPageIndex] = useState(1);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedSchedule, setSelectedSchedule] = useState() as any;

  const pageSize = 6;

  const { listInterviewData, refetchListInterview } =
    useInterviewContext() || {};

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.interviewSchedule + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json()),

    onError: (error) => {},

    onSuccess: () => {

      toast.success("Schedule deleted successfully");
      refetch();

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
      <div className="grid h-full grid-cols-3 gap-6">
        {listInterviewData?.interviewSchedules &&
          listInterviewData.interviewSchedules.map(
            (interview: InterViewScheduleInterface) => (
              <Card
                key={interview.id as string}
                className="w-full"
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
                <CardBody onClick={() => handlePress(interview.id)}>
                  <div className="mb-2 grid grid-cols-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Start date: </span>
                      {formatedDate(interview.interviewDate)}
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <span className="font-semibold">Start time: </span>
                      {interview.startTime}
                    </div>
                  </div>
                  <div className="mb-2 mt-1">
                    {" "}
                    <span className="font-semibold">Interviewed by: </span>
                    {interview.interviewer?.fullName}
                  </div>

                  <div className="mb-2 mt-1">
                    <span className="font-semibold">Duration: </span>
                    {formatedTimeToMinutes(interview.timeDuration)} mins
                  </div>
                  <div className="mb-2 mt-1 flex gap-2">
                    <span className="font-semibold">Interview type: </span>
                    <div className="text-blue-600">
                      {interview.interviewFormat}
                    </div>
                  </div>
                  <div className="mb-2 mt-1 flex gap-2">
                    <span className="font-semibold">Interview location: </span>

                    {interview.interviewFormat === "Online" ? (
                      <Link
                        href="http://localhost:3000"
                        className="text-blue-600 underline"
                      >
                        Link
                      </Link>
                    ) : (
                      interview.interviewLocation
                    )}
                  </div>
                </CardBody>
              </Card>
            ),
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

      <Pagination
        className="m-4 flex justify-center"
        isCompact
        loop
        showControls
        total={
          listInterviewData?.totalPages
            ? Number(listInterviewData.totalPages)
            : 0
        }
        initialPage={pageIndex}
        onChange={(page) => {
          setPageIndex(page);
        }}
      />
    </div>
  );
}
