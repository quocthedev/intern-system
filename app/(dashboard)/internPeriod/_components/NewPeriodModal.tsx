"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/date-picker";
import { CreateIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { parseDate } from "@internationalized/date"; // Parses a date string or Date object to DateValue
import { useMutation } from "@tanstack/react-query";
import { apiEndpoints } from "@/libs/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PeriodData {
  name: string;
  startDate: string;
  endDate: string;
  internshipDuration: number;
  description: string;
  universityAttended: string;
  numberOfMember: number;
  status: number;
}

export default function NewPeriodModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universityAttended, setUniversityAttended] = useState("");
  const [internshipDuration, setinternshipDuration] = useState("");
  const [totalMember, settotalMember] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(
    parseDate(new Date().toISOString().split("T")[0]),
  );
  const [endDate, setEndDate] = useState(
    parseDate(new Date().toISOString().split("T")[0]),
  );

  const { mutate } = useMutation({
    mutationFn: async (newPeriod: PeriodData) => {
      const response = await fetch(apiEndpoints.internPeriod, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPeriod),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to create intern period");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error:", error); // Log the error to the console
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("New intern period created successfully!");
      onClose();
    },
  });

  const handleSubmit = () => {
    mutate({
      name,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
      internshipDuration: Number(internshipDuration),
      description,
      universityAttended,
      numberOfMember: Number(totalMember),
      status: Number(status),
    });
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
        startContent={<CreateIcon />}
        className="text-white"
        variant="shadow"
        onPress={onOpen}
      >
        New Intern Period
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Intern Period
            </ModalHeader>

            <ModalBody className="gap-5">
              <div className="grid grid-cols-3 gap-5">
                <Input
                  label="Period Name"
                  placeholder="Enter period name"
                  labelPlacement="outside"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isRequired
                />
                <Input
                  label="Description"
                  placeholder="Enter description"
                  labelPlacement="outside"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  isRequired
                />
                <Input
                  label="University attended"
                  placeholder="Enter university"
                  labelPlacement="outside"
                  value={universityAttended}
                  onChange={(e) => setUniversityAttended(e.target.value)}
                  isRequired
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Internship Duration"
                  placeholder="Enter duration (months)"
                  labelPlacement="outside"
                  value={internshipDuration}
                  onChange={(e) => setinternshipDuration(e.target.value)}
                  isRequired
                />

                <Input
                  label="Total member"
                  placeholder="Enter total member"
                  labelPlacement="outside"
                  value={totalMember}
                  onChange={(e) => settotalMember(e.target.value)}
                  isRequired
                />
                <Input
                  label="Status"
                  placeholder="Enter period status"
                  labelPlacement="outside"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  isRequired
                />
              </div>

              <div className="flex w-full gap-3">
                <DatePicker
                  label="Start date"
                  labelPlacement="outside"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate)}
                  isRequired
                />
                <DatePicker
                  label="End date"
                  labelPlacement="outside"
                  value={endDate}
                  onChange={(endDate) => setEndDate(endDate)}
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleSubmit} className="w-full">
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        draggable
      />
    </>
  );
}
