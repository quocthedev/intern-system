import { formatDate } from "@/app/util";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { cn } from "@nextui-org/theme";
import React from "react";

export type GeneralInformationProps = {
  project: {
    title: string;
    productUri: string;
    zaloUri: string;
    startDate: string;
    releaseDate: string;
    listPosition: { name: string }[];
    listTechnology: { abbreviation: string }[];
    className?: string;
  };
};
export default function GeneralInformation({
  project,
}: GeneralInformationProps) {
  return (
    <div className="mt-3 flex w-[700px] flex-col">
      <h1 className="text-xl font-semibold">General Information</h1>

      <div className="flex flex-col gap-1">
        <p className="mt-2">Title: {project.title}</p>
        <p>
          Product URI:{" "}
          <Link href={project.productUri} target="_blank">
            Link
          </Link>
        </p>

        <p>
          Group Zalo:{" "}
          <Link href={project.zaloUri} target="_blank">
            Link
          </Link>
        </p>

        <div className="flex gap-4">
          <p>Start Date: {formatDate(project.startDate.split("T")[0])}</p>

          <p>Release Date: {formatDate(project.releaseDate.split("T")[0])}</p>
        </div>

        <p className="flex gap-3">
          Position:{" "}
          <span className="text-blue-500">
            {project.listPosition.map((position) => position.name).join(" ")}
          </span>
        </p>
        <p className="flex gap-3">
          Tech Stack:{" "}
          <span className="text-blue-500">
            {project.listTechnology
              .map((technology) => technology.abbreviation)
              .join(", ")}
          </span>
        </p>
      </div>
    </div>
  );
}
