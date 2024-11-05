"use client";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { AddIcon } from "./Icons";
import { Input } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/date-picker";

export default function NewProjectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        size="md"
        startContent={<AddIcon />}
        className="text-white"
        variant="shadow"
        onPress={onOpen}
      >
        New Project
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Project
              </ModalHeader>

              <ModalBody className="gap-5">
                <Input
                  label="Project name"
                  placeholder="Enter project name"
                  labelPlacement="outside"
                />
                <Input
                  label="Position"
                  placeholder="Add positions included in the project: frontend, backend,..."
                  labelPlacement="outside"
                />

                <Input
                  label="Technologies"
                  placeholder="Add technology stacks utilized within project’s scope: java, nodejs, python,..."
                  labelPlacement="outside"
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Leader"
                    placeholder="Enter username"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Sub Leader"
                    placeholder="Enter username"
                    labelPlacement="outside"
                  />

                  <Input
                    label="Mentor"
                    placeholder="Enter username"
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
