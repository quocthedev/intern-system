import { Card, CardBody } from "@nextui-org/card";
import { cn } from "@nextui-org/react";
import { Dropdown, DropdownTrigger } from "@nextui-org/dropdown";
import UserDropdown from "./UserDropdown";
import { cookies } from "next/headers";
import UserInfo from "./UserInfo";

export type UserProps = {
  className?: string;
};

export default function User({ className }: UserProps) {
  const cookiesStore = cookies();

  const userId = cookiesStore.get("userId")?.value as string;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Card className={cn("hover:scale-105 hover:cursor-pointer", className)}>
          <CardBody className="justify-left items-start">
            <UserInfo userId={userId} />
          </CardBody>
        </Card>
      </DropdownTrigger>
      <UserDropdown />
    </Dropdown>
  );
}
