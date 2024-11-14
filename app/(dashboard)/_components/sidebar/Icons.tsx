import DashboardActiveSVG from "@/public/icons/sidebar/dashboard-active.svg";
import DashboardInactiveSVG from "@/public/icons/sidebar/dashboard-inactive.svg";
import AccountManagementActiveSVG from "@/public/icons/sidebar/account-management-active.svg";
import AccountManagementInactiveSVG from "@/public/icons/sidebar/account-management-inactive.svg";
import InternManagementActiveSVG from "@/public/icons/sidebar/intern-management-active.svg";
import InternManagementInactiveSVG from "@/public/icons/sidebar/intern-management-inactive.svg";
import ProjectManagementActiveSVG from "@/public/icons/sidebar/project-management-active.svg";
import ProjectManagementInactiveSVG from "@/public/icons/sidebar/project-management-inactive.svg";
import PositionManagementActiveSVG from "@/public/icons/sidebar/position-management-active.svg";
import PositionManagementInactiveSVG from "@/public/icons/sidebar/position-management-inactive.svg";
import TechnologyManagementActiveSVG from "@/public/icons/sidebar/technology-management-active.svg";
import TechnologyManagementInactiveSVG from "@/public/icons/sidebar/technology-management-inactive.svg";
import QuestionManagementActiveSVG from "@/public/icons/sidebar/question-management-active.svg";
import QuestionManagementInactiveSVG from "@/public/icons/sidebar/question-management-inactive.svg";

import Image from "next/image";

type SidebarIconProps = {
  active?: boolean;
  size?: number;
  className?: string;
};
export const DashboardIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={active ? DashboardActiveSVG : DashboardInactiveSVG}
    alt="Dashboard"
    width={size}
    height={size}
    className={className}
  />
);

export const AccountManagementIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={active ? AccountManagementActiveSVG : AccountManagementInactiveSVG}
    alt="Account Management"
    width={size}
    height={size}
    className={className}
  />
);

export const InternManagementIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={active ? InternManagementActiveSVG : InternManagementInactiveSVG}
    alt="Intern Management"
    width={size}
    height={size}
    className={className}
  />
);

export const ProjectManagementIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={active ? ProjectManagementActiveSVG : ProjectManagementInactiveSVG}
    alt="Project Management"
    width={size}
    height={size}
    className={className}
  />
);

export const PositionManagementIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={active ? PositionManagementActiveSVG : PositionManagementInactiveSVG}
    alt="Position Management"
    width={size}
    height={size}
    className={className}
  />
);

export const TechnologyManagementIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={
      active ? TechnologyManagementActiveSVG : TechnologyManagementInactiveSVG
    }
    alt="Technology Management"
    width={size}
    height={size}
    className={className}
  />
);

export const QuestionManagementIcon = ({
  active = false,
  size = 24,
  className,
}: SidebarIconProps) => (
  <Image
    src={active ? QuestionManagementActiveSVG : QuestionManagementInactiveSVG}
    alt="Question Management"
    width={size}
    height={size}
    className={className}
  />
);

export default {
  DashboardIcon,
  AccountManagementIcon,
  InternManagementIcon,
  ProjectManagementIcon,
  PositionManagementIcon,
  TechnologyManagementIcon,
  QuestionManagementIcon,
};
