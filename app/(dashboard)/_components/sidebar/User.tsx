import { Card, CardBody } from "@nextui-org/card";
import { cn } from "@nextui-org/theme";
import { User as UserComponent } from "@nextui-org/user";
import { Dropdown, DropdownTrigger } from "@nextui-org/dropdown";
import UserDropdown from "./UserDropdown";
import { cookies } from "next/headers";

export type UserProps = {
  className?: string;
};

export default function User({ className }: UserProps) {
  const cookiesStore = cookies();

  const user = {
    name: cookiesStore.get("userName")?.value as string,
    role: cookiesStore.get("userRole")?.value as string,
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
      <UserDropdown />
    </Dropdown>
  );
}
