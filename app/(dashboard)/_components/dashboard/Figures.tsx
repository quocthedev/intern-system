import { Card, CardBody } from "@nextui-org/card";
import React from "react";
import { FigureIcon } from "./Icons";
import { cn } from "@nextui-org/theme";

const figures = [
  {
    number: 200,
    description: "Total students received CV",
  },
  {
    number: 200,
    description: "Total students interviewed",
  },
  {
    number: 200,
    description: "Total students passed",
  },
  {
    number: 200,
    description: "Total students interning",
  },
];
type FigureProps = {
  className?: string;
};
export default function Figures({ className }: FigureProps) {
  return (
    <div className={cn("grid w-full grid-cols-4 gap-3", className)}>
      {figures.map((figure, index) => (
        <Card key={index}>
          <CardBody>
            <div className="flex items-center gap-4">
              <FigureIcon size={56} />
              <div className="flex flex-col">
                <p className="text-xl font-semibold">{figure.number}</p>
                <p className="text-xs text-grey">{figure.description}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
