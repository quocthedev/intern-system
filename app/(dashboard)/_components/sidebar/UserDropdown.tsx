"use client";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";

export default function UserDropdown() {
  const router = useRouter();

  const logoutUser = async () => {
    // window.localStorage.clear();
    await logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownSection>
        <DropdownItem>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem className="text-danger-500" onClick={logoutUser}>
          Logout
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
