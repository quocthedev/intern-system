"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExcelIcon } from "@/app/(dashboard)/intern/_components/Icons";

function ImportExcelModal() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState<
    string | null
  >(null);
  const [selectedInternPeriodId, setSelectedInternPeriodId] = useState<
    string | null
  >(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    const file = e.target?.files?.[0];

    if (file) {
      setSelectedFile(file);
      setAlertMessage(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setAlertMessage("Please selected file first!");
    }

    // Sending file to API with query parameters
    const formData = new FormData();

    formData.append("file", selectedFile as Blob);

    try {
      await axios.post(
        API_ENDPOINTS.candidate +
          `/import-candidate-list?internPeriodId=${selectedInternPeriodId}&universityId=${selectedUniversityId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Upload file successfully!");
      onClose(); // Close modal
      await refetch(); // Refetch data if needed
    } catch (error) {
      toast.error("Error uploading file");
      console.log("Upload error:", error);
    }
  };

  const {
    data: allData,

    refetch,
  } = useQuery({
    queryKey: ["sharedAllData"],
    queryFn: async () => {
      const [universityData, internperiodData] = await Promise.all([
        fetch(API_ENDPOINTS.university).then((res) => res.json()),
        fetch(API_ENDPOINTS.internPeriod).then((res) => res.json()),
      ]);

      return {
        university: universityData?.data?.pagingData || [],
        internperiod: internperiodData?.data?.pagingData || [],
      };
    },
    enabled: shouldFetchData,
  });

  const handleOpen = () => {
    onOpen();
    setShouldFetchData(true);
  };

  const universityData = allData?.university || [];
  const internperiodData = allData?.internperiod || [];

  interface InternPeriod {
    id: string;
    name: string;
  }

  interface University {
    id: string;
    name: string;
  }

  return (
    <div>
      <Button
        color="success"
        size="sm"
        startContent={<ExcelIcon />}
        className="text-white"
        variant="shadow"
        onPress={handleOpen}
      >
        Import excel file
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-6/12">
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Intern
            </ModalHeader>

            <ModalBody className="gap-4">
              <div className="grid grid-cols-2 gap-5">
                <Select
                  items={internperiodData}
                  placeholder="Select intern period"
                  label="Intern period"
                  className="max-w-xs"
                  onSelectionChange={(id) => {
                    const internPeriodId = Array.from(id).join(","); // Convert to string

                    setSelectedInternPeriodId(internPeriodId);
                  }}
                >
                  {(internPeriod: InternPeriod) => (
                    <SelectItem key={internPeriod.id} value={internPeriod.id}>
                      {internPeriod.name}
                    </SelectItem>
                  )}
                </Select>
                <Select
                  items={universityData}
                  placeholder="Select university"
                  label="University"
                  className="max-w-xs"
                  onSelectionChange={(id) => {
                    const universityId = Array.from(id).join(","); // Convert to string

                    setSelectedUniversityId(universityId);
                  }}
                >
                  {(university: University) => (
                    <SelectItem key={university.id} value={university.id}>
                      {university.name}
                    </SelectItem>
                  )}
                </Select>
              </div>

              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              {alertMessage && (
                <div className="text-red-500">{alertMessage}</div>
              )}
              <Button
                color="primary"
                onPressStart={handleFileUpload}
                className="w-full"
              >
                Submit
              </Button>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ImportExcelModal;
