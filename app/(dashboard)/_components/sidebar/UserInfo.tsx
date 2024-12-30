"use client";
import { useUser } from "@/data-store/user.store";
import React from "react";
import { User as UserComponent } from "@nextui-org/user";
import { Spinner } from "@nextui-org/react";

export type UserInfoProps = {
  userId: string;

  className?: string;
};
export default function UserInfo({ userId }: UserInfoProps) {
  const { data: user, isLoading, error } = useUser({ userId });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <UserComponent
      name={user?.userName}
      description={user?.role.name}
      avatarProps={{
        src: user?.avatar,
      }}
    />
  );
}
