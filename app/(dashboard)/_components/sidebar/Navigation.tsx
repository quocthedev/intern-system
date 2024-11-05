"use client";
import {
  DashboardIcon,
  AccountManagementIcon,
  PositionManagementIcon,
  InternManagementIcon,
  ProjectManagementIcon,
  TechnologyManagementIcon,
} from "./Icons";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { cn } from "@nextui-org/theme";
import { usePathname } from "next/navigation";

type NavigationProps = {
  className?: string;
};

export const NavigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: DashboardIcon,
  },
  {
    label: "Projects",
    href: "/project",
    icon: ProjectManagementIcon,
  },
  {
    label: "Interns",
    href: "/intern",
    icon: InternManagementIcon,
  },
  {
    label: "Internship period",
    href: "/internPeriod",
    icon: InternManagementIcon,
  },
  {
    label: "Universities",
    href: "/university",
    icon: InternManagementIcon,
  },
  {
    label: "Positions",
    href: "/position",
    icon: PositionManagementIcon,
  },
  {
    label: "Questions",
    href: "/question",
    icon: TechnologyManagementIcon,
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
