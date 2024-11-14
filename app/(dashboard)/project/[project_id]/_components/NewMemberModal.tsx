"use client";
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
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { CandidateUser, GetCandidateUsersResponse } from "../_types/Candidate";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { addNewMembers } from "@/actions/add-new-members";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error);
  },
});

export type NewMemberModalProps = {
  projectId: string;
};

export default function NewMemberModal(props: NewMemberModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const roleMapping: Record<string, string> = {};

  const { data, isLoading, error } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await apiClient.get<GetCandidateUsersResponse>(
        API_ENDPOINTS.candidateUser,
        {},
        true,
      );

      console.log(response);

      if (response?.statusCode === "200") {
        const { data } = response;

        console.log(data);

        return data;
      }

      return [];
    },
  });

  const submitAddNewMembers = async () => {
    const candidates = Array.from(selectedKeys).map((key) => ({
      userId: key,
      role: Number(roleMapping[key] || "4"),
    }));

    await addNewMembers(props.projectId, candidates);
  };

  const columns = [
    {
      key: "fullName",
      title: "Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "position",
      title: "Position",
    },
    {
      key: "rank",
      title: "Rank",
    },
  ];

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

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="shadow">
        Add New Member
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-fit">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1 className="">Add new member</h1>
              </ModalHeader>

              <ModalBody className="">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      label="Search by member name"
                      size="sm"
                    />

                    <Table
                      fullWidth
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={(selectedKeys) => {
                        setSelectedKeys(selectedKeys as Set<never>);
                      }}
                    >
                      <TableHeader columns={columns}>
                        {(column) => (
                          <TableColumn key={column.key}>
                            {column.title}
                          </TableColumn>
                        )}
                      </TableHeader>

                      <TableBody>
                        {(data || []).map((candidate) => (
                          <TableRow key={candidate.id}>
                            {(columnKey) => (
                              <TableCell>
                                {candidate[columnKey as keyof typeof candidate]}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Show selected member */}
                  <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-semibold">Selected members</h1>

                    {Array.from(selectedKeys).map((key) => {
                      const candidate = (data as CandidateUser[]).find(
                        (m) => m.id == key,
                      );

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between gap-2"
                        >
                          <span>{candidate?.fullName}</span>

                          <Select
                            defaultSelectedKeys={["4"]}
                            onSelectionChange={(selectedKeys) => {
                              roleMapping[key] =
                                selectedKeys.currentKey as string;
                            }}
                            className="w-[200px]"
                          >
                            {roles.map((role) => (
                              <SelectItem key={role.key}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" fullWidth onClick={submitAddNewMembers}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
