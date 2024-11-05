import React from "react";
import { Divider } from "@nextui-org/divider";
import Navigation from "./Navigation";
import User from "./User";

export default function SideBar() {
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
}
