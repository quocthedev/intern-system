import FigureSVG from "@/public/icons/others/figure-icon.svg";
import CalendarSVG from "@/public/icons/others/calendar-icon.svg";
import UniversitySVG from "@/public/icons/others/university-icon.svg";
import Image from "next/image";

type IconProps = {
  size?: number;
  className?: string;
};
export const FigureIcon = ({ size = 56, className }: IconProps) => (
  <Image
    src={FigureSVG}
    alt="figure"
    width={size}
    height={size}
    className={className}
  />
);

export const CalendarIcon = ({ size = 18, className }: IconProps) => (
  <Image
    src={CalendarSVG}
    alt="calendar"
    width={size}
    height={size}
    className={className}
  />
);

export const UniversityIcon = ({ size = 18, className }: IconProps) => (
  <Image
    src={UniversitySVG}
    alt="university"
    width={size}
    height={size}
    className={className}
  />
);
