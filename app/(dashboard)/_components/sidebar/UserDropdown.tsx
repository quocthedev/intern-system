"use client";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import React from "react";
import {
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { getCookie } from "@/app/util";

export default function UserDropdown() {
  const router = useRouter();
  const role = getCookie("userRole");
  const id = getCookie("userId");
  const logoutUser = async () => {
    // window.localStorage.clear();
    await logout();
    router.push("/login");
    window.location.reload();
  };

  const handleMove = () => {
    if (role === "Candidate") {
      router.push(`/userCandidate/${id}`);
    } else router.push(`/account/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownSection>
        <DropdownItem onClick={handleMove}>Profile</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem
          href="
          /password-change
        "
        >
          Change Password
        </DropdownItem>
        <DropdownItem className="text-danger-500" onClick={logoutUser}>
          Logout
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
