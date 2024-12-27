"use client";

import Link from "next/link";
import React from "react";
import InternPeriodProvider from "./_providers/InternPeriodDetailProvider";
import InternPeriodInformation from "./_components/InternPeriodInformation";
import RelatedUniversities from "./_components/RelatedUniversities";

export default function PeriodDetailPage() {
  return (
    <InternPeriodProvider>
      <div className="flex h-full w-full flex-col p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="flex items-center">
            <Link
              href="/internPeriod"
              className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Internship period
            </Link>
            <span className="mx-2"> &gt; </span>
            <span className="font-semibold">
              {" "}
              Internship period information{" "}
            </span>
          </div>
        </div>

        <InternPeriodInformation />

        <RelatedUniversities />
      </div>
    </InternPeriodProvider>
  );
}
