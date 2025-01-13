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
import { AddIcon } from "@/app/(dashboard)/position/_components/Icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { toast } from "sonner";
import { getCookie } from "@/app/util";

export default function NewPostionModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const accessToken = getCookie("accessToken");

  const { mutate, isPending } = useMutation({
    mutationFn: async (newPosition: FormData) => {
      const response = await fetch(API_ENDPOINTS.position, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: newPosition,
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message);
      }

      return response.json();
    },

    onError: (error) => {
      toast.error(error.message);
    },

    onSuccess: () => {
      toast.success("New position added successfully!");
      queryClient.invalidateQueries();
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!name || !abbreviation || !selectedFile) {
      toast.error("Please fill out all fields and select an image.");

      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("abbreviation", abbreviation);
    formData.append("image", selectedFile);
    mutate(formData);
  };

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
        New Position
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-lg">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Position
            </ModalHeader>

            <ModalBody>
              <div className="gap-5">
                <Input
                  label="Position Name"
                  placeholder="Enter position name"
                  labelPlacement="outside"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-8"
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
              <div className="mb-2">
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
              <Button onPress={onClose} className="w-full">
                Cancel
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
