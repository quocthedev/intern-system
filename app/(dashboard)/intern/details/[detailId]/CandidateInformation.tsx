import { formatedDate } from "@/app/util";
import { API_ENDPOINTS } from "@/libs/config";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export default function CandidateInformationPage() {
  const params = useParams();
  const candidateId = params.detailId as string;

  const { isLoading, data } = useQuery({
    queryKey: ["data", candidateId],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.candidate + "/" + candidateId);
      const candidate = response.json();

      return candidate;
    },
  });

  const candidateData = data?.data || {};

  console.log(candidateData);

  return (
    <div className="p-8">
      <div className="flex gap-6">
        <div className="flex w-1/3 flex-col items-center">
          <img
            width={200}
            height={200}
            alt="Avatar"
            src={`https://i.${candidateData?.avatar?.slice(8)}.jpeg`}
            className="mb-4 rounded-full object-cover"
          />
          <Button className="mb-2">Change Avatar</Button>

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
            <h1 className="mb-2 border-b border-gray-700 pb-1 text-xl font-semibold text-black">
              Profile
            </h1>
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
                <span className="font-medium text-gray-900">Address:</span>{" "}
                {candidateData?.address || "N/A"}
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
    </div>
  );
}
