import { Spinner } from "@nextui-org/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Spinner />
    </div>
  );
}
