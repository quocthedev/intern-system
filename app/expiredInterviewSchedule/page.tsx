import { Card, CardBody } from "@nextui-org/card";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
export default function ExpiredInterviewSchedule() {
  const router = useRouter();

  useEffect(() => {
    // Example: Redirect to a specific page if needed
    const urlParams = new URLSearchParams(window.location.search);
    const redirectTo = urlParams.get("redirect");

    if (redirectTo) {
      router.push(redirectTo); // Redirect based on URL parameters
    }
  }, [router]);

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
