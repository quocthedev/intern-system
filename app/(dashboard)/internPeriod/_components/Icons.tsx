import EmailIconSVG from "@/public/icons/actionbar/mail-icon.svg";
import CreateIconSVG from "@/public/icons/actionbar/add-icon.svg";
import DeleteIconSVG from "@/public/icons/actionbar/delete-red-icon.svg";
import ExcelIconSVG from "@/public/icons/actionbar/excel-icon.svg";
import FilterIconSVG from "@/public/icons/actionbar/filter-icon.svg";
import EditIconSVG from "@/public/icons/others/edit-icon.svg";
import ViewIconSVG from "@/public/icons/others/view-icon.svg";
import CandidateIconSVG from "@/public/icons/sidebar/intern-management-inactive.svg";
import EllipsisIconSVG from "@/public/icons/others/ellipsis-icon.svg";
import CreateQuestionIconSVG from "@/public/icons/others/create-question-icon.svg";

import Image from "next/image";

type ActionBarIconsProps = {
  size?: number;
  className?: string;
};

export const EmailIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Email Icon"
    width={size}
    height={size}
    src={EmailIconSVG}
    className={className}
  />
);

export const CreateIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Email Icon"
    width={size}
    height={size}
    src={CreateIconSVG}
    className={className}
  />
);

export const DeleteIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Delete Icon"
    width={size}
    height={size}
    src={DeleteIconSVG}
    className={className}
  />
);

export const ExcelIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Excel Icon"
    width={size}
    height={size}
    src={ExcelIconSVG}
    className={className}
  />
);

export const FilterIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Filter Icon"
    width={size}
    height={size}
    src={FilterIconSVG}
    className={className}
  />
);

export const EditIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Filter Icon"
    width={size}
    height={size}
    src={EditIconSVG}
    className={className}
  />
);

export const ViewIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Filter Icon"
    width={size}
    height={size}
    src={ViewIconSVG}
    className={className}
  />
);

export const EllipsisIcon = ({ size = 20, className }: ActionBarIconsProps) => (
  <Image
    alt="Filter Icon"
    width={size}
    height={size}
    src={EllipsisIconSVG}
    className={className}
  />
);

export const CandidateIcon = ({
  size = 20,
  className,
}: ActionBarIconsProps) => (
  <Image
    alt="Filter Icon"
    width={size}
    height={size}
    src={CandidateIconSVG}
    className={className}
  />
);

export const CreateQuestionIcon = ({
  size = 20,
  className,
}: ActionBarIconsProps) => (
  <Image
    alt="Filter Icon"
    width={size}
    height={size}
    src={CreateQuestionIconSVG}
    className={className}
  />
);
