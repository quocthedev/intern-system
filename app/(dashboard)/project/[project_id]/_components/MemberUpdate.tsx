import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import React from "react";
import { EditIcon } from "../../_components/Icons";
import { updateMember } from "@/actions/update-member";

export type MemberUpdateProps = {
  projectName: string;
  projectId: string;
  memberName: string;
  memberId: string;
  role: string;
};
export default function MemberUpdate(props: MemberUpdateProps) {
  const roles = [
    {
      key: "0",
      name: "Creator",
    },
    {
      key: "1",
      name: "Leader",
    },
    {
      key: "2",
      name: "Subleader",
    },
    {
      key: "3",
      name: "Mentor",
    },
    {
      key: "4",
      name: "Member",
    },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [role, setRole] = React.useState<string>(
    roles.find((role) => role.name === props.role)?.key || "4",
  );

  const submit = async () => {
    await updateMember({
      userId: props.memberId,
      role,
      projectId: props.projectId,
    });
  };

  return (
    <>
      <Button onClick={onOpen} isIconOnly variant="light">
        <EditIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-[400px]">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Update Member</h1>
              </ModalHeader>

              <ModalBody className="">
                <div className="flex flex-col gap-3">
                  <Input
                    type="text"
                    placeholder="Project Name"
                    label="Project"
                    labelPlacement="outside"
                    value={props.projectName}
                    disabled
                  />
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      label="Name"
                      value={props.memberName}
                      disabled
                      labelPlacement="outside"
                    />

                    <Select
                      label="Role"
                      defaultSelectedKeys={
                        roles.find((role) => role.name === props.role)?.key
                      }
                      onSelectionChange={(selectedKeys) => {
                        setRole(selectedKeys.currentKey as string);
                      }}
                      labelPlacement="outside"
                    >
                      {roles.map((role) => (
                        <SelectItem key={role.key}>{role.name}</SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full flex-col gap-3">
                  <Button
                    color="primary"
                    fullWidth
                    variant="shadow"
                    onClick={async () => {
                      await submit();
                      // onClose();
                    }}
                  >
                    Update
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
