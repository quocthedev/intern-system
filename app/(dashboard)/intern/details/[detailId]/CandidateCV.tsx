import { formatedDate } from "@/app/util";
import { API_ENDPOINTS } from "@/libs/config";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export default function CandidateCVPage() {
  const params = useParams();
  const candidateId = params.detailId as string;

  const { isLoading, data } = useQuery({
    queryKey: ["data", candidateId],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.candidate + "/" + candidateId);
      const candidate = response.json();

      return candidate;
    },
  });

  const candidateData = data?.data || {};

  return <div className="p-8">{candidateData.cvUri}</div>;
}
