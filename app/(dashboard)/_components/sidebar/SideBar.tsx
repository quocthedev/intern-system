import React from "react";
import { Divider } from "@nextui-org/divider";
import Navigation from "./Navigation";
import User from "./User";
import { cookies } from "next/headers";
import Image from "next/image";

export default function SideBar() {
  const cookiesStore = cookies();

  const role = cookiesStore.get("userRole")?.value as string;

  if (role !== "Candidate") {
    return (
      <div className="flex h-full w-sidebar-expand flex-col items-center px-3">
        {/* Title */}
        <p className="my-10 text-2xl font-bold text-title">Intern System</p>
        <Divider orientation="horizontal" className="bg-grey" />

        {/* Navigation */}
        <Navigation className="mt-10" />

        {/* Footer*/}

        <User className="mb-3 mt-auto w-full" />
      </div>
    );
  } else
    return (
      <div className="h-sidebar-horizontal flex w-full items-center justify-between px-8 py-2">
        <Image
          width={150}
          height={150}
          alt="Amazing tech logo"
          src="/icons/technology/amazingtech.png"
        />
        <div className="text-2xl font-bold text-title">
          Intern Management Systerm
        </div>
        <User className="mb-3 mt-auto max-w-fit" />
      </div>
    );
}
