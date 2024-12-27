import { Fira_Code as FontMono, Inter as FontSans } from "next/font/google";
import { Poppins, Roboto} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"], // You can specify different weights
  subsets: ["latin"],
  variable: "--font-poppins",
});


export const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins",
});
