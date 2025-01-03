import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import React from "react";
import { TrashIcon } from "@/components/icons/OtherIcons";
import { deleteMember } from "@/actions/delete-member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useProjectDetailContext } from "@/app/(dashboard)/project/_providers/ProjectDetailProvider";
import { DeleteIcon } from "@/app/(dashboard)/project/_components/Icons";
export type MemberDeleteModalProps = {
  projectId: string;
  memberId: string;
};

export default function MemberDeleteModal(props: MemberDeleteModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const { refetchProjectSummary } = useProjectDetailContext();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await deleteMember(props.projectId, props.memberId);

      if (response.statusCode !== "200") {
        toast.error(response.message);

        return;
      }

      toast.success("Member deleted successfully");
      refetchProjectSummary();
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <>
      <Button onPress={onOpen} isIconOnly variant="light">
        <DeleteIcon size={20} />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-[800px]">
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Delete Member</h1>
              </ModalHeader>
              <ModalBody className="">
                <h1>Are you sure you want to delete this member?</h1>
              </ModalBody>

              <ModalFooter>
                <Button
                  onClick={() => {
                    handleDelete();
                    onClose();
                  }}
                  fullWidth
                  variant="shadow"
                  color="danger"
                >
                  Delete
                </Button>
                <Button fullWidth onPress={() => onClose()}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
