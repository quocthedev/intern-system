import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { FigureIcon } from "./Icons";
import { cn } from "@nextui-org/react";

const figures = [
  {
    number: 200,
    description: "Total universities",
  },
  {
    number: 200,
    description: "Total candidates",
  },
  {
    number: 200,
    description: "Total projects",
  },
  {
    number: 200,
    description: "Completed OJT",
  },
  {
    number: 200,
    description: "Active interns",
  },
];

type FigureProps = {
  className?: string;
};
export default function Figures({ className }: FigureProps) {
  return (
    <div className={cn("grid w-full grid-cols-5 gap-6", className)}>
      {figures.map((figure, index) => (
        <Card key={index}>
          <CardBody>
            <div className="flex items-center gap-4">
              <FigureIcon size={56} />
              <div className="flex flex-col">
                <p className="text-xs text-grey">{figure.description}</p>
                <p className="text-xl font-semibold">{figure.number}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
