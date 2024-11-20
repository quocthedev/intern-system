"use server";

import APIClient from "@/libs/api-client";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/libs/config";
import { parseZonedDateTime } from "@internationalized/date";
const apiClient = new APIClient(
  // Add a response interceptor to handle errors
  {
    onRejected: (error) => {
      console.error(error);
      return {
        data: {
          error: error.message,
        },
      };
    },
  },
);

export async function sendEmail(data: FormData) {
  const recipients = data.get("recipients")?.toString().split(",") as string[];
  const subject = data.get("subject")?.toString() as string;
  // const dateTime = new Time(data.get("dateTime")?.toString())
  // const time = data.get("time")?.toString();
  const dateTime = parseZonedDateTime(
    data.get("dateTime")?.toString() as string,
  ).toDate() as Date;

  const date = dateTime.toISOString().split("T")[0];
  const time = `${dateTime.getHours()}:${dateTime.getMinutes()}`;

  const format = Number(data.get("format")) as number;
  const location = data.get("location")?.toString() as string;
  const interviewer = data.get("interviewer")?.toString() as string;
  const duration = data.get("duration")?.toString() as string;

  const params = {
    recipients,
    subject,
    date,
    time,
    duration,
    format,
    location,
    interviewer,
  };

  console.log(params);

  const formData = new FormData();
  formData.append("Subject", params.subject);

  params.recipients.forEach((recipient) => {
    formData.append("Recipients", recipient);
  });

  formData.append("InterviewSchedule.InterviewDate", params.date);
  formData.append("InterviewSchedule.StartTime", params.time);
  formData.append("InterviewSchedule.TimeDuration", params.duration);
  formData.append("InterviewSchedule.InterviewFormat", String(params.format));
  formData.append("InterviewSchedule.InterviewLocation", params.location);
  formData.append("InterviewSchedule.InterviewerId", params.interviewer);

  const accessToken = cookies().get("accessToken");

  const result = await apiClient.post(API_ENDPOINTS.sendEmail, formData, {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${accessToken?.value}`,
  });

  console.log(result);
}
