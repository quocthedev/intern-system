"use client";

import React from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import CandidateInformationPage from "@/app/(dashboard)/intern/details/[detailId]/CandidateInformation";
import Link from "next/link";
import CandidateCVPage from "@/app/(dashboard)/intern/details/[detailId]/CandidateCV";
import InterviewInformation from "../../_components/InterviewInformation";
import { useParams } from "next/navigation";

export default function CandidateDetailPage() {
  const params = useParams();
  const candidateId = params.detailId as string;
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div className="flex items-center">
          <Link
            href="/intern"
            className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Candidate management
          </Link>
          <span className="mx-2"> &gt; </span>
          <span className="font-semibold"> Candidate detail </span>
        </div>
      </div>

      <Tabs aria-label="Options" radius="sm" color="primary" className="mt-3">
        <Tab key="1" title="Information">
          <CandidateInformationPage />
        </Tab>
        <Tab key="2" title="CV">
          <CandidateCVPage />
        </Tab>
        <Tab key="3" title="Interview Information">
          <InterviewInformation candidateId={candidateId} />
        </Tab>
        <Tab key="4" title="Evaluation">
          <CandidateInformationPage />
        </Tab>
      </Tabs>
    </div>
  );
}
