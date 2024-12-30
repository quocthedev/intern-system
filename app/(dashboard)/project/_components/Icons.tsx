import ExcelSVG from "@/public/icons/actionbar/excel-icon.svg";
import DeleteSVG from "@/public/icons/actionbar/delete-red-icon.svg";
import AddSVG from "@/public/icons/actionbar/add-icon.svg";

import FilterSVG from "@/public/icons/actionbar/filter-icon.svg";
import EditSVG from "@/public/icons/others/edit-icon.svg";
import Image from "next/image";

type ActionBarIconProps = {
  size?: number;
  className?: string;
};
export const ExcelIcon = ({ size = 24, className }: ActionBarIconProps) => (
  <Image
    src={ExcelSVG}
    alt="Excel"
    width={size}
    height={size}
    className={className}
  />
);

export const DeleteIcon = ({ size = 24, className }: ActionBarIconProps) => (
  <Image
    src={DeleteSVG}
    alt="Delete"
    width={size}
    height={size}
    className={className}
  />
);

export const AddIcon = ({ size = 24, className }: ActionBarIconProps) => (
  <Image
    src={AddSVG}
    alt="Add"
    width={size}
    height={size}
    className={className}
  />
);

export const FilterIcon = ({ size = 24, className }: ActionBarIconProps) => (
  <Image
    src={FilterSVG}
    alt="Filter"
    width={size}
    height={size}
    className={className}
  />
);

export const EditIcon = ({ size = 18, className }: ActionBarIconProps) => (
  <Image
    src={EditSVG}
    alt="Edit"
    width={size}
    height={size}
    className={className}
  />
);

export default {
  ExcelIcon,
  DeleteIcon,
  AddIcon,
  FilterIcon,
  EditIcon,
};
