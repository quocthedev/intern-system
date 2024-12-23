import { Card, CardBody } from "@nextui-org/card";
import React from "react";
export default function ExpiredInterviewSchedule() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardBody>
          <form className="flex w-full flex-col gap-3 p-3">
            <div>
              <p>
                This interview link has been expired due to it expiration date.
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
