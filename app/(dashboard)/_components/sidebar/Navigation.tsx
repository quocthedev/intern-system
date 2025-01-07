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

// export const AccordionItems = [
//   {
//     label: "Candidates",
//     href: "/intern",
//     icon: InternManagementIcon,
//   },
//   {
//     label: "Intern periods",
//     href: "/internPeriod",
//     icon: InternManagementIcon,
//   },
//   {
//     label: "Universities",
//     href: "/university",
//     icon: InternManagementIcon,
//   },
// ];

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

const labelsToRemoveHR = [
  "Projects",
  "Questions",
  "Interns",
  "Positions",
  "Technologies",
  "Accounts",
  "Interviews",
];

const labelsToRemoveMentor = [
  "Questions",
  "Interns",
  "Positions",
  "Technologies",
  "Accounts",
];

const labelsToRemoveUniver = [
  "Projects",
  "Questions",
  "Interns",
  "Positions",
  "Technologies",
  "Accounts",
  "Interviews",
];

const labelsToRemoveCandidate = [
  "Dashboard",
  "Questions",
  "Interns",
  "Positions",
  "Technologies",
  "Accounts",
  "Interviews",
];

if (role === "HR Manager") {
  for (const label of labelsToRemoveHR) {
    const index = NavigationItems.findIndex((item) => item.label === label);

    if (index !== -1) {
      NavigationItems.splice(index, 1);
    }
  }
  NavigationItems.push(
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
      label: "Interviews",
      href: "/interview",
      icon: InterviewManagementIcon,
    },
  );
}

if (role === "Mentor") {
  for (const label of labelsToRemoveMentor) {
    const index = NavigationItems.findIndex((item) => item.label === label);

    if (index !== -1) {
      NavigationItems.splice(index, 1);
    }
  }
  NavigationItems.push({
    label: "Candidates",
    href: "/intern",
    icon: InternManagementIcon,
  });
}

if (role === "University Official") {
  for (const label of labelsToRemoveUniver) {
    const index = NavigationItems.findIndex((item) => item.label === label);

    if (index !== -1) {
      NavigationItems.splice(index, 1);
    }
  }
  NavigationItems.push(
    {
      label: "Candidates",
      href: "/intern",
      icon: InternManagementIcon,
    },
    {
      label: "Intern Periods",
      href: "/internPeriod",
      icon: InterviewManagementIcon,
    },
  );
}

if (role === "Candidate") {
  for (const label of labelsToRemoveCandidate) {
    const index = NavigationItems.findIndex((item) => item.label === label);

    if (index !== -1) {
      NavigationItems.splice(index, 1);
    }
  }
}

export default function Navigation(props: NavigationProps) {
  const currentPath = usePathname();

  return (
    <div className={cn("flex w-full flex-col gap-4", props.className)}>
      {NavigationItems.map((item) => {
        const isActive = item.href === `/${currentPath.split("/")[1]}`;

        // if (item.label === "Interns") {
        //   return (
        //     <Accordion key={item.label}>
        //       <AccordionItem
        //         aria-label="Intern Accordion"
        //         title="Internship"
        //         startContent={<InternManagementIcon />}
        //         classNames={{
        //           base: "px-1",
        //           trigger: "py-0",
        //           title: "text-sm text-grey font-medium",
        //         }}
        //       >
        //         {AccordionItems.map((AccordionItem) => {
        //           const isAccordionItemActive =
        //             AccordionItem.href === `/${currentPath.split("/")[1]}`;

        //           return (
        //             <Button
        //               color="primary"
        //               variant={isAccordionItemActive ? "shadow" : "light"}
        //               as={Link}
        //               startContent={
        //                 <AccordionItem.icon
        //                   size={20}
        //                   active={isAccordionItemActive}
        //                 />
        //               }
        //               className={cn(
        //                 "m-1 w-full justify-start text-sm font-medium text-grey",
        //                 isAccordionItemActive && "font-semibold text-white",
        //               )}
        //               href={AccordionItem.href}
        //               size="md"
        //               key={AccordionItem.label}
        //             >
        //               {AccordionItem.label}
        //             </Button>
        //           );
        //         })}
        //       </AccordionItem>
        //     </Accordion>
        //   );
        // }

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
