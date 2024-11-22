import { formatedDate } from "@/app/util";
import { API_ENDPOINTS } from "@/libs/config";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CandidateInformationPage() {
  const params = useParams();
  const candidateId = params.detailId as string;

  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
    onOpenChange: onOpenEditChange,
  } = useDisclosure();

  const [updateData, setUpdateData] = useState({
    studentCode: "",
    fullName: "",
    doB: "",
    universityEmail: "",
    personalEmail: "",
    phoneNumber: "",
    phoneNumberRelative: "",
    address: "",
    gender: 0,
    major: "",
    gpa: 0,
    englishLevel: "",
    cvUri: "",
    desiredPosition: "",
    status: 0,
    internPeriodId: "",
    universityId: "",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["data", candidateId],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.candidate + "/" + candidateId);
      const candidate = await response.json();

      return candidate;
    },
  });

  const candidateData = data?.data || {};

  const updateMutation = useMutation({
    mutationFn: async () => {
      await fetch(API_ENDPOINTS.candidate + "/" + candidateId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
    },
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  // <SelectItem key="0">Pending</SelectItem>
  // <SelectItem key="1">Approved</SelectItem>
  // <SelectItem key="2">Rejected</SelectItem>
  // <SelectItem key="3">InterviewEmailSent</SelectItem>
  // <SelectItem key="4">CompletedOJT</SelectItem>
  // <SelectItem key="5">Out</SelectItem>

  const getStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return "0";
      case "Approved":
        return "1";
      case "Rejected":
        return "2";
      case "InterviewEmailSent":
        return "3";
      case "CompletedOJT":
        return "4";
      case "Out":
        return "5";
      default:
        return "Unknown";
    }
  };

  const openEditModal = () => {
    setUpdateData({
      studentCode: candidateData?.studentCode || "",
      fullName: candidateData?.fullName || "",
      doB: candidateData?.doB || "",
      universityEmail: candidateData?.universityEmail || "",
      personalEmail: candidateData?.personalEmail || "",
      phoneNumber: candidateData?.phoneNumber || "",
      phoneNumberRelative: candidateData?.phoneNumberRelative || "",
      address: candidateData?.address || "",
      gender: candidateData?.gender === "Male" ? 0 : 1,
      major: candidateData?.major || "",
      gpa: candidateData?.gpa || 0,
      englishLevel: candidateData?.englishLevel || "",
      cvUri: candidateData?.cvUri || "",
      desiredPosition: candidateData?.desiredPosition || "",
      status: Number(getStatus(candidateData?.status)),
      internPeriodId: candidateData?.internPeriodViewModel?.id || "",
      universityId: candidateData?.universityViewModel?.id || "",
    });
    onOpenEdit();
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_ENDPOINTS.candidate}/${candidateId}/upload-avatar`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      await refetch();
      toast.success("Avatar change successfully!");
    } catch (error) {
      toast.error("Error changing avatar");
      console.error(error);
    }
  };

  useEffect(() => {
    handleUpload();
  }, [selectedFile]);

  return (
    <div className="p-8">
      <div className="flex gap-4">
        <div className="flex w-1/3 flex-col items-center">
          {candidateData.image ? (
            <Image
              width={200}
              height={200}
              alt={`${candidateData.name} Image`}
              src={candidateData.avatar}
              className="h-40 w-full rounded-md object-contain"
            />
          ) : (
            <Image
              width={200}
              height={200}
              layout="responsive"
              alt="Default Candidate Image"
              src="/icons/technology/noimg.png"
              className="rounded-md object-contain"
            />
          )}

          <div>
            <Button
              onPress={() => document.getElementById("uploadImage")?.click()}
              color="primary"
              size="sm"
            >
              Change Avatar
            </Button>

            <input
              id="uploadImage"
              type="file"
              accept=".png"
              onChange={handleFileChange}
              hidden
            />
          </div>

          <div className="font-medium text-gray-600">
            Status:{" "}
            {candidateData?.status === "Approved" ? (
              <span className="text-green-500">{candidateData?.status}</span>
            ) : candidateData?.status === "Rejected" ? (
              <span className="text-danger">{candidateData?.status}</span>
            ) : (
              <span className="text-warning">{candidateData?.status}</span>
            )}
          </div>
        </div>

        <div className="w-2/3">
          <div className="mb-8">
            <h1 className="flex items-center justify-between border-b border-gray-700 pb-1 text-xl font-semibold text-black">
              Profile
              <Button className="mb-2" onClick={openEditModal} color="primary">
                Update profile
              </Button>
            </h1>
            <Modal
              isOpen={isEditOpen}
              className="max-w-6xl"
              onClose={onCloseEdit}
            >
              <ModalContent>
                <ModalHeader>Edit Candidate Information</ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-3 gap-5">
                    <Input
                      label="Full Name"
                      value={updateData.fullName}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          fullName: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Student Code"
                      value={updateData.studentCode}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          studentCode: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Date of Birth"
                      value={formatedDate(updateData.doB)}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, doB: e.target.value })
                      }
                    />
                    <Input
                      label="University Email"
                      value={updateData.universityEmail}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          universityEmail: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Personal Email"
                      value={updateData.personalEmail}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          personalEmail: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Phone Number"
                      value={updateData.phoneNumber}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Relative Phone Number"
                      value={updateData.phoneNumberRelative}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          phoneNumberRelative: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Address"
                      value={updateData.address}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          address: e.target.value,
                        })
                      }
                    />
                    <Select
                      label="Gender"
                      value={updateData.gender.toString()}
                      defaultSelectedKeys={updateData.gender.toString()} // Bind to gender value ('0' for Male, '1' for Female)
                      onChange={(e) => {
                        setUpdateData({
                          ...updateData,
                          gender: Number(e.target.value), // Convert selected value back to number (0 or 1)
                        });
                      }}
                    >
                      <SelectItem key="0">Male</SelectItem>
                      <SelectItem key="1">Female</SelectItem>
                    </Select>
                    <Input
                      label="Major"
                      value={updateData.major}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, major: e.target.value })
                      }
                    />
                    <Input
                      label="GPA"
                      value={updateData.gpa.toString()}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          gpa: parseFloat(e.target.value),
                        })
                      }
                      type="number"
                    />
                    <Input
                      label="English Level"
                      value={updateData.englishLevel}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          englishLevel: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Desired Position"
                      value={updateData.desiredPosition}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          desiredPosition: e.target.value,
                        })
                      }
                    />
                    {/* <Input
                      label="CV URI"
                      value={updateData.cvUri}
                      onChange={(e) =>
                        setUpdateData({ ...updateData, cvUri: e.target.value })
                      }
                    />
                    <Input
                      label="Internship Period ID"
                      value={updateData.internPeriodId}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          internPeriodId: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="University ID"
                      value={updateData.universityId}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          universityId: e.target.value,
                        })
                      }
                    /> */}

                    <Select
                      label="Status"
                      value={updateData.status}
                      defaultSelectedKeys={updateData.status.toString()}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          status: parseInt(e.target.value),
                        })
                      }
                    >
                      <SelectItem key="0">Pending</SelectItem>
                      <SelectItem key="1">Approved</SelectItem>
                      <SelectItem key="2">Rejected</SelectItem>
                      <SelectItem key="3">InterviewEmailSent</SelectItem>
                      <SelectItem key="4">CompletedOJT</SelectItem>
                      <SelectItem key="5">Out</SelectItem>
                    </Select>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={() => updateMutation.mutate()}>
                    Save Changes
                  </Button>
                  <Button onClick={onCloseEdit}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <div className="grid grid-cols-[56%_44%] gap-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Full Name:</span>{" "}
                {candidateData?.fullName || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Email:</span>{" "}
                {candidateData?.personalEmail || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  Date of Birth:
                </span>{" "}
                {formatedDate(candidateData?.doB) || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Phone:</span>{" "}
                {candidateData?.phoneNumber || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  Relative Phone:
                </span>{" "}
                {candidateData?.phoneNumberRelative || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Gender:</span>{" "}
                {candidateData?.gender || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Address:</span>
                {candidateData?.address || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  Intern period:
                </span>
                {candidateData?.internPeriodViewModel?.name || "N/A"}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h1 className="mb-2 border-b border-gray-700 pb-1 text-xl font-semibold text-black">
              Education
            </h1>
            <div className="grid grid-cols-[56%_44%] gap-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">University:</span>{" "}
                {candidateData?.universityViewModel?.name || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">Student Code:</span>{" "}
                {candidateData?.studentCode || "N/A"}
              </div>

              <div>
                <span className="font-medium text-gray-900">Major:</span>{" "}
                {candidateData?.major || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">GPA:</span>{" "}
                {candidateData?.gpa || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  University Email:
                </span>{" "}
                <span>{candidateData?.universityEmail || "N/A"}</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="mb-2 border-b border-gray-700 pb-1 text-xl font-semibold text-black">
              Additional
            </h1>
            <div className="grid grid-cols-[56%_44%] gap-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">
                  English Level:
                </span>{" "}
                {candidateData?.englishLevel || "N/A"}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  Desired Position:
                </span>{" "}
                {candidateData?.desiredPosition || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </div>
  );
}
