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
          <p>Start Date: {project.startDate.split("T")[0]}</p>

          <p>Release Date: {project.releaseDate.split("T")[0]}</p>
        </div>

        <p>
          Position:{" "}
          {project.listPosition.map((position, id) => (
            <Link key={position.name} href={"#"}>
              {position.name}
              {
                // Add a comma after each position except the last one
                id !== project.listPosition.length - 1 ? ", " : ""
              }
              {
                // Add a space after each comma
                id !== project.listPosition.length - 1 ? " " : ""
              }
            </Link>
          ))}
        </p>
        <p>Tech Stack: </p>
      </div>
    </div>
  );
}
