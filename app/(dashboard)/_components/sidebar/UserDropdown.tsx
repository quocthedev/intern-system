"use client";
import { logout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { DropdownMenu, DropdownItem } from "@nextui-org/dropdown";
import { getCookie } from "@/app/util";
import { redirect } from "next/dist/server/api-utils";

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
  const handleMoveProject = () => {
    router.push("/projectCandidate");
  };
  const changePassword = () => {
    router.push("/password-change");
  };

  const items = [
    {
      name: "Profile",
      key: "profile",
      onClick: handleMove,
    },
    { name: "Projects", key: "projects", onClick: handleMoveProject },
    {
      name: "Change password",
      key: "changePassword",
      onClick: changePassword,
    },
    {
      name: "Logout",
      key: "logout",
      onClick: logoutUser,
    },
  ];

  if (role !== "Candidate") {
    items.splice(1, 1);
  }
  if (role == "Candidate") {
    items.splice(2, 1);
  }

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
      {(item) => (
        <DropdownItem
          className={item.key === "logout" ? "text-red-500" : ""}
          key={item.key}
        >
          {item.name}
        </DropdownItem>
      )}
    </DropdownMenu>
  );
}
