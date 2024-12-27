"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { toast } from "sonner";
import { ExcelIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import APIClient from "@/libs/api-client";

interface PeriodModalIdProps {
  internPeriodId: string | null;
  universityId: string | null;
}

function ImportExcelModal3({
  internPeriodId,
  universityId,
}: PeriodModalIdProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUniversityId] = useState<string | null>(universityId);
  const [selectedInternPeriodId] = useState<string | null>(internPeriodId);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const apiClient = new APIClient({
    onFulfilled: (response) => response,
    onRejected: (error) => {
      console.log(error.response.data);

      return {
        data: error.response.data,
      };
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      setSelectedFile(file);
      setAlertMessage(null);
    }
  };

  const queryClient = useQueryClient();

  // Mutation for file upload
  const { mutate } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<{
        statusCode: string;
        message: string;
      }>(
        `${API_ENDPOINTS.candidate}/import-candidate-list?internPeriodId=${selectedInternPeriodId}&universityId=${selectedUniversityId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.statusCode !== "200") {
        const errorMessage = response.message || "Failed to upload file";

        throw new Error(errorMessage);
      }

      return response;
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Upload file successfully!");
      queryClient.invalidateQueries(); // Refetch relevant queries
      onClose(); // Close modal or reset state
    },
  });

  // Event handler for file upload
  const handleFileUpload = () => {
    if (!selectedFile) {
      setAlertMessage("Please select a file first!");

      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile as Blob);

    // Trigger the mutation
    mutate(formData);
  };

  const handleOpen = () => {
    onOpen();
  };
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <div>
        <Button
          color="success"
          size="md"
          startContent={<ExcelIcon />}
          onPress={handleOpen}
          className="text-white"
          variant="shadow"
        >
          Import excel file
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-lg">
          <ModalContent>
            <>
              <ModalHeader className="flex items-center justify-between">
                <span>Import candidate list</span>
              </ModalHeader>
              <Divider />
              <ModalBody className="mt-2 gap-4">
                <Link
                  href="/files/Example_Excel.xlsx"
                  className="text-blue-500"
                >
                  <div>Download example file</div>
                </Link>

                <div>
                  <label
                    htmlFor="file-upload"
                    className="flex max-h-10 max-w-full cursor-pointer items-center rounded-lg border bg-green-500 p-3 shadow-sm hover:bg-green-400"
                  >
                    <ExcelIcon className="h-5 w-5 text-white" />
                    <span className="ml-2 text-sm font-medium text-white">
                      {selectedFile ? "Change File.xlsx" : "Upload File.xlsx"}
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      handleFileChange(e);
                    }}
                    className="hidden"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Selected File:</span>{" "}
                      {selectedFile.name}
                    </p>
                  )}

                  {/* Alert Message */}
                  {alertMessage && (
                    <div className="mt-2 text-sm text-red-500">
                      {alertMessage}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Button
                    color="primary"
                    onPressStart={handleFileUpload}
                    className="w-full"
                  >
                    Submit
                  </Button>
                  <Button
                    color="default"
                    onPressStart={handleClose}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            </>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default ImportExcelModal3;
