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
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { toast } from "sonner";
import { useUniversity } from "@/data-store/university";
import { Select, SelectItem } from "@nextui-org/select";
import { useInternPeriodContext } from "../_providers/InternPeriodProvider";
import { CalendarDate, parseDate } from "@internationalized/date";
import { addMonths } from "date-fns";
import { getCookie } from "@/app/util";

interface CreatePeriodData {
  internPeriod: {
    name: string;
    description: string;
    internshipDuration: number;
    maxCandidateQuantity: number;
    startDate: string;
    endDate: string;
  };
  universityIds: string[];
}

export default function NewPeriodModalNext() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { refetchListInternPeriod } = useInternPeriodContext();
  const accessToken = getCookie("accessToken");

  const { mutate } = useMutation({
    mutationFn: async (newPeriod: CreatePeriodData) => {
      const response = await fetch(API_ENDPOINTS.internPeriod, {
        method: "POST",
        headers: {
          Athorization: `Bearer ${accessToken}`,
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
      refetchListInternPeriod();
      onClose();
    },
  });

  const { isLoading, error, data } = useUniversity({ pageSize: 12 });

  const [startDate, setStartDate] = useState(
    parseDate(
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    ),
  );
  const [endDate, setEndDate] = useState(
    parseDate(
      new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    ),
  );
  const [internshipDuration, setInternshipDuration] = useState("");

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = e.target.value;

    setInternshipDuration(newDuration);

    const durationInMonths = parseInt(newDuration, 10);

    const updatedEndDate = addMonths(
      new Date(startDate.toString()),
      durationInMonths,
    );

    setEndDate(parseDate(updatedEndDate.toISOString().split("T")[0]));
  };

  const formAction = async (data: FormData) => {
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const internshipDuration = data.get("internshipDuration") as string;
    const maxCandidateQuantity = data.get("maxCandidateQuantity") as string;
    const startDate = data.get("startDate") as string;
    const endDate = data.get("endDate") as string;

    const universityIds = data.getAll("universities") as string[];

    const params = {
      universityIds,
      internPeriod: {
        name,
        description,
        internshipDuration: Number(internshipDuration),
        maxCandidateQuantity: Number(maxCandidateQuantity),
        startDate: startDate,
        endDate: endDate,
      },
    };

    mutate(params);
  };

  return (
    <>
      <Button
        color="primary"
        size="md"
        startContent={<CreateIcon />}
        className="text-white"
        variant="shadow"
        onPress={onOpen}
      >
        New Intern Period
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-xl">
        <ModalContent>
          <form action={formAction}>
            <ModalHeader className="flex flex-col gap-1">
              Add New Intern Period
            </ModalHeader>

            <ModalBody className="gap-5">
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Period Name"
                  placeholder="Enter period name"
                  labelPlacement="outside"
                  isRequired
                  name="name"
                />
                <Input
                  label="Description"
                  placeholder="Enter description"
                  labelPlacement="outside"
                  name="description"
                />

                <Input
                  label="Internship Duration"
                  placeholder="Enter duration (months)"
                  labelPlacement="outside"
                  value={internshipDuration}
                  onChange={handleDurationChange}
                  isRequired
                  type="number"
                  min="1"
                  name="internshipDuration"
                />

                <Input
                  label="Total member"
                  placeholder="Enter total member"
                  labelPlacement="outside"
                  type="number"
                  min="1"
                  isRequired
                  name="maxCandidateQuantity"
                />
                <DatePicker
                  label="Start date"
                  labelPlacement="outside"
                  value={startDate}
                  onChange={(newDate) => setStartDate(newDate as CalendarDate)}
                  isRequired
                  name="startDate"
                />
                <DatePicker
                  label="End date"
                  labelPlacement="outside"
                  value={endDate}
                  onChange={(newDate) => setEndDate(newDate as CalendarDate)}
                  isRequired
                  name="endDate"
                />
              </div>
              <Select
                label="University Attended"
                name="universities"
                selectionMode="multiple"
              >
                {(data?.universities ?? []).map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" variant="shadow" fullWidth type="submit">
                Submit
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
