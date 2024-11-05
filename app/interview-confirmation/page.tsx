"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { Textarea } from "@nextui-org/input";
import { useSearchParams } from "next/navigation";
import React from "react";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Button } from "@nextui-org/button";
import { confirmAttendance } from "@/actions/confirm-attendance";
import { useFormStatus } from "react-dom";
import { stat } from "fs";
import { Spinner } from "@nextui-org/spinner";

export default function InterviewConfirmation() {
  const searchParams = useSearchParams();
  // Get query params from the URL
  const scheduleId = searchParams.get("scheduleId");
  const candidateId = searchParams.get("candidateId");
  const [isSending, setIsSending] = React.useState(false);
  const [isReject, setIsReject] = React.useState(true);

  // Makesure the scheduleId and candidateId are not null
  if (!scheduleId || !candidateId) {
    return (
      <div>
        <h1>Invalid URL</h1>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardBody>
          {isSending ? (
            <Spinner />
          ) : (
            <form
              className="flex w-full flex-col gap-3 p-3"
              action={(formData: FormData) => {
                formData.append("candidateId", candidateId);
                formData.append("scheduleId", scheduleId);

                setIsSending(true);
                confirmAttendance(formData);
                setIsSending(false);
              }}
            >
              <h1 className="font-bold">Interview Confirmation</h1>

              <p>
                Please confirm your attendance to the interview. If you are
                unable to attend, please reject the invitation and provide a
                reason.
              </p>

              <RadioGroup
                label="
              Proceed to the interview?
            "
                name="status"
                defaultValue="0"
              >
                <Radio
                  value={"1"}
                  onClick={() => setIsReject(false)}
                  isDisabled={isSending}
                >
                  Accept
                </Radio>

                <Radio
                  value={"0"}
                  onClick={() => setIsReject(true)}
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
              <Button color="primary" type="submit">
                Send
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
