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
                ⚠️ Unfortunately, this interview link is no longer valid as its
                expiration date has passed.
              </p>

              <p>
                📧 Please check your email or contact the recruitment team for
                further assistance.
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
