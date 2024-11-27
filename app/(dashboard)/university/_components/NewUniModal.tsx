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
import { CreateIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { toast } from "sonner";

export default function NewUniverModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [address, setAddress] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (newUni: FormData) => {
      const response = await fetch(API_ENDPOINTS.university, {
        method: "POST",
        body: newUni,
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message);
      }

      return response.json();
    },

    onError: (error) => {
      console.error("Error:", error); // Log the error to the console
      toast.error(error.message);
    },

    onSuccess: () => {
      toast.success("New university added successfully!");
      queryClient.invalidateQueries(); // Refetch data
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!name || !abbreviation || !address || !selectedFile) {
      toast.error("All fields are required and select an image!");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("abbreviation", abbreviation);
    formData.append("address", address);
    formData.append("image", selectedFile);
    mutate(formData);
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
        New University
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New University
            </ModalHeader>

            <ModalBody className="gap-5">
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="University Name"
                  placeholder="Enter university name"
                  labelPlacement="outside"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isRequired
                />
                <Input
                  label="Abbreviation"
                  placeholder="Enter abbreviation"
                  labelPlacement="outside"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  isRequired
                />
              </div>
              <div className="grid gap-4">
                <Input
                  label="Address"
                  placeholder="Enter university's address "
                  labelPlacement="outside"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isRequired
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                >
                  Upload Image
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".png, .jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Selected file: </span>
                    {selectedFile.name}
                  </p>
                )}
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
    </>
  );
}
