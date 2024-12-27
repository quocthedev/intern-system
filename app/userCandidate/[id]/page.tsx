"use client";

import { getCookie } from "@/app/util";
import { API_ENDPOINTS } from "@/libs/config";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function UserCandidatePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const { isLoading, data: CandidateData } = useQuery({
    queryKey: ["data", userId],
    queryFn: async () => {
      const response = await fetch(
        `${API_ENDPOINTS.user}/${userId}/candidate-profile`,
      );
      const candidate = await response.json();

      return candidate;
    },
  });

  const candidateDataId = CandidateData?.data?.id;

  useEffect(() => {
    if (candidateDataId) {
      // Redirect to the candidate page once the ID is fetched
      router.replace(`/userCandidate/detail/${candidateDataId}?tab=2`);
    }
  }, [candidateDataId, router]);

  return null;
}
