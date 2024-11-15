import TrashSVG from "@/public/icons/others/trash.svg";
import Image from "next/image";

type ActionBarIconProps = {
  size?: number;
  className?: string;
};
export const TrashIcon = ({ size = 24, className }: ActionBarIconProps) => (
  <Image
    src={TrashSVG}
    alt="Trash"
    width={size}
    height={size}
    className={className}
  />
);
