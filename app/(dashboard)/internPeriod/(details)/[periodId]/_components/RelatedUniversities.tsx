"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";
import { useInternPeriodContext } from "../_providers/InternPeriodDetailProvider";
import UniversityCandidateCard from "./UniversityCandidateCard";
import UniversityCandidateProvider from "../_providers/UniversityCandidateProvider";

const customAccordionTitle = (universityName: string, abbreviation: string) => {
  return (
    <div className="flex items-center gap-2">
      {universityName}
      <span className="text-gray-500">({abbreviation})</span>
    </div>
  );
};

export default function RelatedUniversities() {
  const { internPeriodData, isInternPeriodLoading } = useInternPeriodContext();

  return (
    <>
      {isInternPeriodLoading ? (
        <div>
          <Skeleton className="mt-4 rounded-lg">
            <div className="h-12">Accordion</div>
          </Skeleton>
          <Skeleton className="mt-4 rounded-lg">
            <div className="h-12">Accordion</div>
          </Skeleton>
        </div>
      ) : (
        <div>
          <Accordion className="mt-4 gap-4 rounded-lg p-0" variant="splitted">
            {(internPeriodData?.universities ?? []).map((university) => {
              return (
                <AccordionItem
                  title={customAccordionTitle(
                    university.name,
                    university.abbreviation,
                  )}
                  key={university.id}
                >
                  <UniversityCandidateProvider
                    internPeriodId={internPeriodData?.id}
                    universityId={university.id}
                    key={university.id}
                  >
                    <UniversityCandidateCard />
                  </UniversityCandidateProvider>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </>
  );
}
