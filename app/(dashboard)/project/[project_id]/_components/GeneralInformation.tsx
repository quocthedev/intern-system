import { formatDate } from "@/app/util";
import { Link } from "@nextui-org/link";
import React from "react";
import { useProjectDetailContext } from "../../_providers/ProjectDetailProvider";
import Loading from "@/components/Loading";

export default function GeneralInformation() {
  const { projectSummary, isLoadingProjectSummary } = useProjectDetailContext();

  if (isLoadingProjectSummary) {
    return <Loading />;
  }

  return (
    <div className="mt-3 flex w-[700px] flex-col">
      <h1 className="text-xl font-semibold">General Information</h1>

      <div className="flex flex-col gap-1">
        <p className="mt-2">Title: {projectSummary?.title}</p>
        <p>
          Product URI:{" "}
          <Link href={projectSummary?.productUri} target="_blank">
            Link
          </Link>
        </p>

        <p>
          Group Zalo:{" "}
          <Link href={projectSummary?.zaloUri} target="_blank">
            Link
          </Link>
        </p>

        <div className="flex gap-4">
          <p>
            Start Date: {formatDate(projectSummary?.startDate.split("T")[0])}
          </p>

          <p>
            Release Date:{" "}
            {formatDate(projectSummary?.releaseDate.split("T")[0])}
          </p>
        </div>

        <p className="flex gap-3">
          Position:{" "}
          <span className="text-blue-500">
            {projectSummary?.listPosition
              .map((position) => position.name)
              .join(" ")}
          </span>
        </p>
        <p className="flex gap-3">
          Tech Stack:{" "}
          <span className="text-blue-500">
            {projectSummary?.listTechnology
              .map((technology) => technology.abbreviation)
              .join(", ")}
          </span>
        </p>
      </div>
    </div>
  );
}
