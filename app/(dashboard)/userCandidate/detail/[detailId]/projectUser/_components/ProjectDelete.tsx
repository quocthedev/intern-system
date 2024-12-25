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
import { toast } from "sonner";
import { DeleteProject } from "@/actions/delete-project";
import { useProjectListContext } from "@/app/(dashboard)/project/_providers/ProjectListProvider";
import { useMutation } from "@tanstack/react-query";
export type ProjectDeleteProps = {
  projectId: string;
};

export default function ProjectDelete(props: ProjectDeleteProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { refetchProjectList } = useProjectListContext();

  const mutation = useMutation({
    mutationFn: DeleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully");
      refetchProjectList();
    },
    onError: (error: any) => {
      toast.error("Failed to delete project" + error);
    },
  });

  const handleDelete = () => {
    mutation.mutate(props.projectId);
  };

  return (
    <>
      <Button onClick={onOpen} isIconOnly variant="light">
        <TrashIcon size={16} />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="w-[800px]">
        <ModalContent className="">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Delete Project</h1>
              </ModalHeader>
              <ModalBody className="">
                <h1>Are you sure you want to delete this project?</h1>
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
