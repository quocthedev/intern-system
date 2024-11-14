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
} from "./Icons";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { cn } from "@nextui-org/theme";
import { usePathname } from "next/navigation";
import { Accordion, AccordionItem } from "@nextui-org/accordion";

type NavigationProps = {
  className?: string;
};

export const AccordionItems = [
  {
    label: "Candidates",
    href: "/intern",
    icon: InternManagementIcon,
  },
  {
    label: "Intern periods",
    href: "/internPeriod",
    icon: InternManagementIcon,
  },
  {
    label: "Universities",
    href: "/university",
    icon: InternManagementIcon,
  },
];

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

        if (item.label === "Interns") {
          return (
            <Accordion key={item.label}>
              <AccordionItem
                aria-label="Intern Accordion"
                title="Internship"
                startContent={<InternManagementIcon />}
                classNames={{
                  base: "px-1",
                  trigger: "py-0",
                  title: "text-sm text-grey font-medium",
                }}
              >
                {AccordionItems.map((AccordionItem) => {
                  const isAccordionItemActive =
                    AccordionItem.href === `/${currentPath.split("/")[1]}`;

                  return (
                    <Button
                      color="primary"
                      variant={isAccordionItemActive ? "shadow" : "light"}
                      as={Link}
                      startContent={
                        <AccordionItem.icon
                          size={20}
                          active={isAccordionItemActive}
                        />
                      }
                      className={cn(
                        "m-1 w-full justify-start text-sm font-medium text-grey",
                        isAccordionItemActive && "font-semibold text-white",
                      )}
                      href={AccordionItem.href}
                      size="md"
                      key={AccordionItem.label}
                    >
                      {AccordionItem.label}
                    </Button>
                  );
                })}
              </AccordionItem>
            </Accordion>
          );
        }

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
