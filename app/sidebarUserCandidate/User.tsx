import { Card, CardBody } from "@nextui-org/card";
import { cn } from "@nextui-org/theme";
import { User as UserComponent } from "@nextui-org/user";
import { Dropdown, DropdownTrigger } from "@nextui-org/dropdown";
import UserDropdown from "./UserDropdown";
// import { cookies } from "next/headers";
import { getCookie } from "@/app/util";

export type UserProps = {
  className?: string;
};

export default function User({ className }: UserProps) {
  // const cookiesStore = cookies();

  const user = {
    name: getCookie("userName"),
    role: getCookie("userRole"),
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
