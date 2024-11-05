"use client";

import { useUser } from "@/hooks/useUser";
import { Card, CardBody } from "@nextui-org/card";
import { cn } from "@nextui-org/theme";
import { User as UserComponent } from "@nextui-org/user";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";

export type UserProps = {
  className?: string;
};

export default function User({ className }: UserProps) {
  const user = useUser((state) => state);
  const router = useRouter();

  const logoutUser = async () => {
    window.localStorage.clear();
    await logout();
    router.push("/login");
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Card className={cn("hover:scale-105 hover:cursor-pointer", className)}>
          <CardBody className="justify-left items-start">
            <UserComponent
              name={user.name}
              description={user.role}
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
            />
          </CardBody>
        </Card>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownSection>
          <DropdownItem>Profile</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem className="text-danger-500" onClick={logoutUser}>
            Logout
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
