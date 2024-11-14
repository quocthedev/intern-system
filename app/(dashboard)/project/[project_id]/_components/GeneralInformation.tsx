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
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Link
            href={project.productUri}
            showAnchorIcon
            className="text-2xl font-semibold"
          >
            {project.title}
          </Link>
        </div>
        <div className="flex gap-3">
          <p className="text-success-500">
            From: {project.startDate.split("T")[0]}
          </p>
          <p className="text-danger-500">
            To: {project.releaseDate.split("T")[0]}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Link href={project.zaloUri} showAnchorIcon>
          Group Zalo
        </Link>
        <div className="flex gap-2">
          <p className="font-semibold">Position:</p>
          <p>
            {project.listPosition?.map((position) => position.name).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
