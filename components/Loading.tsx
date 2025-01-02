import { Spinner } from "@nextui-org/spinner";
import React from "react";

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      Loading <Spinner />
    </div>
  );
}
