import React from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { EditIcon } from "./Icons";
export default function ProjectCard() {
  return (
    <Card>
      <CardHeader className="flex gap-1">
        <div className="flex w-full justify-between">
          <p className="text-lg font-semibold">Intern System</p>
          <div className="flex items-center gap-1">
            <Chip className="bg-warning-400/50 text-warning-700" size="sm">
              In Progress
            </Chip>
            <Button
              variant="light"
              size="sm"
              startContent={<EditIcon />}
              className="text-grey"
            >
              Edit
            </Button>
            <Checkbox />
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Position:</p>
            <p>Back-End, Front-End, BA, Design</p>
          </div>
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Technology:</p>
            <p>.NET, ReactJS, Trello,...</p>
          </div>
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Leader - Sub Leader:</p>
            <div className="flex gap-1">
              <p>John Doe</p>
              <p>-</p>
              <p>Jane Doe</p>
            </div>
          </div>
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Mentor:</p>
            <p>John Doe</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <p className="font-semibold">Zalo Group:</p>
            <Link
              href="https://zalo.me/g/123456789"
              isExternal
              className="text-xs"
            >
              https://zalo.me/g/123456789
            </Link>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex w-full justify-between">
          <p className="text-xs text-success-400">From: 05 Jan 2023</p>
          <p className="text-xs text-danger-400">To: 05 Jan 2024</p>
        </div>
      </CardFooter>
    </Card>
  );
}
