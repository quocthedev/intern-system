import User from "@/app/sidebarUserCandidate/User";
import Image from "next/image";
import React from "react";

export default function SideBarUserCandidate() {
  return (
    <div className="flex h-full w-full flex-row items-center justify-between">
      <div className="text-2xl font-bold text-title">Intern System</div>
      <Image
        width={150}
        height={150}
        alt="Amazing tech logo"
        src="/icons/technology/amazingtech.png"
      />
      <User className="mb-3 mt-auto max-w-fit" />
    </div>
  );
}
