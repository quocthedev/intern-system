"use client";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
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
      router.push(`/candidate/${id}`);
    } else router.push(`/account/${id}`);
  };

  const items = [
    {
      name: "Profile",
      key: "profile",
      onClick: handleMove,
    },
    {
      name: "Settings",
      key: "settings",
    },
    {
      name: "Change Password",
      key: "changePassword",
    },
    {
      name: "Logout",
      key: "logout",
      onClick: logoutUser,
    },
  ];

  return (
    <DropdownMenu
      items={items}
      onAction={async (key) => {
        const item = items.find((item) => item.key === key);

        if (item?.onClick) {
          await item.onClick();
        }
      }}
    >
      {(item) => <DropdownItem key={item.key}>{item.name}</DropdownItem>}
    </DropdownMenu>
  );
}
