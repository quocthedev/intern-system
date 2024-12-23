import { Card, CardBody } from "@nextui-org/card";
import React from "react";

//Hydration bug how to fix is wrap div outside the p tag

export default function page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card>
        <CardBody>
          <form className="flex w-full flex-col gap-3 p-3">
            <div>
              <p>
                Thank you for your response. <br />
                We’re sorry to hear you won’t be able to attend the interview
                this time.
                <br />
                We hope to see you again in the next interview <br />
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
