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
        <DropdownItem key="profile" onPress={handleMove}>
          Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger-500"
          onPress={logoutUser}
        >
          Logout
        </DropdownItem>
      </DropdownSection>
    </DropdownMenu>
  );
}
