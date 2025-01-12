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
import { useUniversityCandidateContext } from "@/app/(dashboard)/internPeriod/(details)/[periodId]/_providers/UniversityCandidateProvider";
import { Spinner } from "@nextui-org/react";
import { getCookie } from "@/app/util";
import APIClient from "@/libs/api-client";
import axios from "axios";

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
  const { refetch } = useUniversityCandidateContext();

  const accessToken = getCookie("accessToken");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];

    if (file) {
      setSelectedFile(file);
      setAlertMessage(null);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.candidate}/import-candidate-list?internPeriodId=${selectedInternPeriodId}&universityId=${selectedUniversityId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to upload file");
        }

        return data;
      } catch (error: any) {
        throw error; // Pass the error to onError
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload file");
    },
    onSuccess: () => {
      toast.success("Upload file successfully!");
      refetch();
      onClose();
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

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    color="primary"
                    onPress={handleFileUpload}
                    className="w-full"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        Uploading <Spinner color="white" size="sm" />
                      </div>
                    ) : (
                      "Upload"
                    )}{" "}
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
