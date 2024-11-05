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
import axios from "axios";
import { apiEndpoints } from "@/libs/config";

export default function NewInternModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [intern, setIntern] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    position: "",
    startDate: "",
    endDate: "",
  });

  const mutation = useMutation({
    mutationFn: (newIntern) => {
      return axios.post(apiEndpoints.candidate, newIntern);
    },
  });

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
        New Intern
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Intern
              </ModalHeader>

              <ModalBody className="gap-5">
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Intern name"
                    placeholder="Enter intern full name"
                    labelPlacement="outside"
                  />
                  <Input
                    label="Date of birth"
                    placeholder="Enter date of birth"
                    labelPlacement="outside"
                  />

                  <Input
                    label="University email"
                    placeholder="Enter University email"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Personal email"
                    placeholder="Enter personal email"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Phone number"
                    placeholder="Enter phone number"
                    labelPlacement="outside"
                  />
                  <Input
                    label="Phone number relative"
                    placeholder="Enter phone number relative"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Address"
                    placeholder="Enter address"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Gender"
                    placeholder="Enter Gender"
                    labelPlacement="outside"
                  />
                  <Input
                    label="Major"
                    placeholder="Enter Major"
                    labelPlacement="outside"
                  />
                  <Input
                    label="GPA"
                    placeholder="Enter GPA"
                    labelPlacement="outside"
                  />
                  <Input
                    label="English level"
                    placeholder="Enter english level"
                    labelPlacement="outside"
                  />
                  <Input
                    label="CV URL"
                    placeholder="Enter CV URL"
                    labelPlacement="outside"
                  />
                  <Input
                    label="Desired position"
                    placeholder="Enter desired position"
                    labelPlacement="outside"
                  />
                  <Input
                    label="Status"
                    placeholder="Enter intern's status"
                    labelPlacement="outside"
                  />
                  <Input
                    label="internPeriodId"
                    placeholder="Enter intern's internPeriodId"
                    labelPlacement="outside"
                  />
                  <Input
                    label="universityId"
                    placeholder="Enter intern's universityId"
                    labelPlacement="outside"
                  />
                </div>

                <div className="flex w-full gap-3">
                  <DatePicker label="Start date" labelPlacement="outside" />
                  <DatePicker label="End date" labelPlacement="outside" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose} className="w-full">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
