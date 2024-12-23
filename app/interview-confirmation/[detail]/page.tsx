import { Card, CardBody } from "@nextui-org/card";
import React from "react";

export default function page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardBody>
          <form className="flex w-full flex-col gap-3 p-3">
            <p>
              🎉 Thank you for confirming your attendance for the interview.{" "}
              <br />
              We’re excited to meet with you and learn more about your skills
              <br />
              and experience. We look forward to speaking with you soon! 🤝
              <br />
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
