"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Textarea } from "@nextui-org/input";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { confirmAttendance } from "@/actions/confirm-attendance";
import { Spinner } from "@nextui-org/spinner";
import { toast } from "sonner";

export default function InterviewReschedule() {
  const searchParams = useSearchParams();
  const router = useRouter(); // For navigation

  const scheduleId = searchParams.get("scheduleId");
  const candidateId = searchParams.get("candidateId");

  const [isSending, setIsSending] = React.useState(false);
  const [isReject, setIsReject] = React.useState(true);

  // Ensure the scheduleId and candidateId are not null
  if (!scheduleId || !candidateId) {
    return (
      <div>
        <h1>Invalid URL</h1>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSending(true);
    formData.append("candidateId", candidateId);
    formData.append("scheduleId", scheduleId);

    await confirmAttendance(formData);

    // Navigate to the home page if the user accepted
    if (!isReject) {
      toast.success("You have accepted to an interview");
      window.history.replaceState(null, "", "interview-confirmation/detail");
      router.push("/interview-confirmation/detail");
    } else {
      setIsSending(false);
      toast.success("You have declined to an interview");
      window.history.replaceState(null, "", "/reject");
      router.push("/reject");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardBody>
          {isSending ? (
            <Spinner />
          ) : (
            <form
              className="flex w-full flex-col gap-3 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                handleSubmit(formData);
              }}
            >
              <h1 className="font-bold">Interview Confirmation</h1>

              <p>
                Please confirm your attendance to the interview. If you are
                unable to attend, please rescheulde of reject the invitation and
                provide a reason.
              </p>

              <RadioGroup
                label="Proceed to the interview?"
                name="status"
                defaultValue="0"
              >
                <Radio
                  value={"1"}
                  onChange={() => {
                    setIsReject(false);
                  }}
                  isDisabled={isSending}
                >
                  Accept
                </Radio>

                <Radio
                  value={"2"}
                  onChange={() => {
                    setIsReject(true);
                  }}
                  isDisabled={isSending}
                >
                  Reject
                </Radio>
              </RadioGroup>
              {isReject && (
                <Textarea
                  label="Reason"
                  placeholder="Please provide a reason"
                  labelPlacement="outside"
                  name="reason"
                />
              )}
              <Button color="primary" type="submit" isDisabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
