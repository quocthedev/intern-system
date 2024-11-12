"use server";

import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";

export async function confirmAttendance(data: FormData) {
  const candidateId = data.get("candidateId")?.toString() as string;
  const scheduleId = data.get("scheduleId")?.toString() as string;
  const status = data.get("status")?.toString() as string;
  const reason = data.get("reason")?.toString() as string;

  const formData = new FormData();
  formData.append("CandidateId", candidateId);
  formData.append("InterviewScheduleId", scheduleId);
  formData.append("Status", status);
  formData.append("Reason", reason);

  const apiClient = new APIClient(
    // Add a response interceptor to handle errors
    {
      onRejected: (error) => {
        console.log(error);
        return {
          data: {
            error: error.message,
          },
        };
      },
    },
  );

  const response = await apiClient.post(API_ENDPOINTS.responseEmail, formData);

  console.log(response);

  return response;
}
