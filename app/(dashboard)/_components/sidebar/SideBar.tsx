import React from "react";
import { Divider } from "@nextui-org/divider";
import Navigation from "./Navigation";
import User from "./User";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import NavigationHR from "@/app/(dashboard)/_components/sidebar/NavigationHR";
import NavigationMentor from "@/app/(dashboard)/_components/sidebar/NavigationMentor";
import NavigationUniversity from "@/app/(dashboard)/_components/sidebar/NavigationUniversity";
import { Button } from "@nextui-org/react";
import {
  HomeIconNavbar,
  ProjectManagementIcon,
} from "@/app/(dashboard)/_components/sidebar/Icons";

export default function SideBar() {
  const cookiesStore = cookies();

  const role = cookiesStore.get("userRole")?.value as string;
  const id = cookiesStore.get("userId")?.value as string;

  if (role !== "Candidate") {
    return (
      <div className="flex h-full w-sidebar-expand flex-col items-center px-3">
        {/* Title */}
        <Link href="/" className="my-6 text-2xl font-bold text-title">
          <div className="flex justify-center">
            <Image
              width={50}
              height={50}
              alt="Amazing tech logo"
              src="/icons/technology/intern.png"
              className="h-16 w-16"
            />
          </div>
          Intern System
        </Link>
        <Divider orientation="horizontal" className="bg-grey" />

        {role === "HR Manager" ? (
          <NavigationHR className="mt-10" />
        ) : role === "Mentor" ? (
          <NavigationMentor className="mt-10" />
        ) : role === "University Official" ? (
          <NavigationUniversity className="mt-10" />
        ) : (
          <Navigation className="mt-10" />
        )}

        {/* Footer*/}

        <User className="mb-3 mt-auto w-full" />
      </div>
    );
  } else
    return (
      <div className="h-sidebar-horizontal flex w-full items-center justify-between px-12 py-2">
        <div>
          <div className="flex items-center">
            <Link href="/" className="my-6 text-lg font-bold text-title">
              <div className="flex justify-center">
                <Image
                  width={50}
                  height={50}
                  alt="Amazing tech logo"
                  src="/icons/technology/intern.png"
                  className="h-8 w-8"
                />
              </div>
              Intern System
            </Link>
            <Link
              className="text-xl font-semibold text-slate-600 transition duration-200 hover:text-blue-600"
              href="/projectCandidate"
            >
              <Button
                className="bg-blue-100 text-lg"
                startContent={<ProjectManagementIcon />}
              >
                {" "}
                Projects
              </Button>
            </Link>
          </div>
        </div>

        <User className="mb-3 mt-auto max-w-fit" />
      </div>
    );
}
