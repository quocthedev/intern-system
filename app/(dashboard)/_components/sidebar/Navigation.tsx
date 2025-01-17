"use client";
import {
  DashboardIcon,
  AccountManagementIcon,
  PositionManagementIcon,
  InternManagementIcon,
  ProjectManagementIcon,
  TechnologyManagementIcon,
  QuestionManagementIcon,
  InterviewManagementIcon,
  UniversityManagementIcon,
} from "./Icons";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { cn } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { getCookie } from "@/app/util";

type NavigationProps = {
  className?: string;
};

const role = getCookie("userRole");

export const NavigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: DashboardIcon,
  },
  {
    label: "Projects",
    href: role === "Candidate" ? "/projectUserCandidate" : "/project",
    icon: ProjectManagementIcon,
  },

  {
    label: "Intern periods",
    href: "/internPeriod",
    icon: InternManagementIcon,
  },
  {
    label: "Universities",
    href: "/university",
    icon: UniversityManagementIcon,
  },
  {
    label: "Positions",
    href: "/position",
    icon: PositionManagementIcon,
  },
  {
    label: "Questions",
    href: "/question",
    icon: QuestionManagementIcon,
  },
  {
    label: "Technologies",
    href: "/technology",
    icon: TechnologyManagementIcon,
  },
  {
    label: "Interviews",
    href: "/interview",
    icon: InterviewManagementIcon,
  },
  {
    label: "Accounts",
    href: "/account",
    icon: AccountManagementIcon,
  },
];

export default function Navigation(props: NavigationProps) {
  const currentPath = usePathname();

  return (
    <div className={cn("flex w-full flex-col gap-4", props.className)}>
      {NavigationItems.map((item) => {
        const isActive = item.href === `/${currentPath.split("/")[1]}`;

        return (
          <Button
            color="primary"
            variant={isActive ? "shadow" : "light"}
            as={Link}
            startContent={<item.icon size={20} active={isActive} />}
            className={cn(
              "w-full justify-start text-sm font-medium text-grey",
              isActive && "font-semibold text-white",
            )}
            href={item.href}
            size="md"
            key={item.label}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
