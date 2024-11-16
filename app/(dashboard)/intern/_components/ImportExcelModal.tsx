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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExcelIcon } from "@/app/(dashboard)/intern/_components/Icons";
import NewPeriodModal from "@/app/(dashboard)/internPeriod/_components/NewPeriodModal";
import { formatedDate } from "@/app/util";
import { Divider } from "@nextui-org/divider";

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
  const [selectedPeriodData, setSelectedPeriodData] =
    useState<InternPeriod | null>(null);

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
      onClose();
      await refetch();
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
    startDate: string;
    endDate: string;
  }

  interface University {
    id: string;
    name: string;
  }

  return (
    <div>
      <Button
        color="success"
        size="md"
        startContent={<ExcelIcon />}
        className="text-white"
        variant="shadow"
        onPress={handleOpen}
      >
        Import excel file
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-xl">
        <ModalContent>
          <>
            <ModalHeader className="flex items-center justify-between">
              <span>Add New Intern</span>
              <div className="mr-4">
                <NewPeriodModal />
              </div>
            </ModalHeader>
            <Divider />
            <ModalBody className="gap-4">
              <div className="grid gap-5">
                <div className="grid gap-5">
                  <div className="flex items-start gap-5">
                    <Select
                      items={internperiodData}
                      placeholder="Select an intern period"
                      label="Intern Period"
                      className="max-w-xs"
                      onSelectionChange={(id) => {
                        const internPeriodId = Array.from(id).join(",");
                        setSelectedInternPeriodId(internPeriodId);

                        const selectedPeriod = internperiodData.find(
                          (period: any) => period.id === internPeriodId,
                        );

                        setSelectedPeriodData(selectedPeriod || null);
                      }}
                    >
                      {(internPeriod: InternPeriod) => (
                        <SelectItem
                          key={internPeriod.id}
                          value={internPeriod.id}
                        >
                          {internPeriod.name}
                        </SelectItem>
                      )}
                    </Select>

                    {selectedPeriodData && (
                      <div className="max-w-sm rounded-md border border-gray-300 bg-gray-50 p-2 shadow-sm">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">
                            Start Date:
                          </span>
                          {formatedDate(selectedPeriodData.startDate)}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-700">
                            End Date:
                          </span>
                          {formatedDate(selectedPeriodData.endDate)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Select
                  items={universityData}
                  placeholder="Select university"
                  label="University"
                  className="max-w-xs"
                  onSelectionChange={(id) => {
                    const universityId = Array.from(id).join(",");

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

              <div>
                <label
                  htmlFor="file-upload"
                  className="flex max-w-xs cursor-pointer items-center justify-center rounded-md border bg-green-600 p-3 shadow-sm hover:bg-green-500"
                >
                  <ExcelIcon className="h-6 w-6 text-gray-700" />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {selectedFile ? "Change File" : "Upload File"}
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
                  onPressStart={onClose}
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
  );
}

export default ImportExcelModal;
