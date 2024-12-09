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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { CandidateUser, GetCandidateUsersResponse } from "../_types/Candidate";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { addNewMembers } from "@/actions/add-new-members";
import { toast } from "sonner";
import { usePosition } from "@/data-store/position.store";
import Loading from "@/components/Loading";
import { Autocomplete } from "@nextui-org/autocomplete";

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
  const queryClient = useQueryClient();

  const { data: positionData, isLoading: isPositionLoading } = usePosition({
    pageSize: 100,
  });

  const [positionFilter, setPositionFilter] = React.useState("");
  const [search, setSearch] = React.useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["members", positionFilter, search],
    queryFn: async () => {
      const response = await apiClient.get<GetCandidateUsersResponse>(
        API_ENDPOINTS.candidateUser,
        {
          params: {
            PositionId: positionFilter === "" ? undefined : positionFilter,
            Search: search,
          },
        },
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
    try {
      const candidates = Array.from(selectedKeys).map((key) => ({
        userId: key,
        role: Number(roleMapping[key] || "3"),
      }));

      await addNewMembers(props.projectId, candidates);
      toast.success("New members added successfully");
      queryClient.invalidateQueries();
    } catch (error) {
      console.log(error);
    }
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
    {
      key: "role",
      title: "Role",
    },
  ];

  const roles = [
    {
      key: "0",
      name: "Leader",
    },
    {
      key: "1",
      name: "Subleader",
    },
    {
      key: "2",
      name: "Mentor",
    },
    {
      key: "3",
      name: "Member",
    },
  ];

  const renderCell = (item: CandidateUser, columnKey: string) => {
    switch (columnKey) {
      case "fullName":
        return item.fullName;
      case "email":
        return item.email;
      case "position":
        return item.position;
      case "rank":
        return item.rank;
      case "role":
        return (
          <Select
            defaultSelectedKeys={["3"]}
            onSelectionChange={(selectedKeys) => {
              roleMapping[item.id] = selectedKeys.currentKey as string;
            }}
            className="w-[150px]"
          >
            {roles.map((role) => (
              <SelectItem key={role.key}>{role.name}</SelectItem>
            ))}
          </Select>
        );
      default:
        return "";
    }
  };

  const positionOptions = (positionData?.positions ?? []).map((position) => ({
    value: position.id,
    label: position.name,
  }));

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="shadow">
        Add New Member
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-[800px]">
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
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Autocomplete
                      defaultItems={positionOptions}
                      // label="Fitler by position"
                      variant="bordered"
                      defaultSelectedKey={""}
                      className="w-[300px]"
                      onSelectionChange={(selectedKey) => {
                        setPositionFilter(selectedKey as string);
                      }}
                      placeholder="Filter by position"
                    >
                      {(item) => (
                        <SelectItem key={item.value}>{item.label}</SelectItem>
                      )}
                    </Autocomplete>

                    <Table
                      fullWidth
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={(selectedKeys) => {
                        setSelectedKeys(selectedKeys as Set<never>);
                      }}
                      className="max-h-[300px]"
                      isHeaderSticky
                    >
                      <TableHeader columns={columns}>
                        {(column) => (
                          <TableColumn key={column.key}>
                            {column.title}
                          </TableColumn>
                        )}
                      </TableHeader>

                      <TableBody
                        isLoading={isLoading}
                        loadingContent={<Loading />}
                        items={data || []}
                      >
                        {(item) => (
                          <TableRow key={item.id}>
                            {(columnKey) => (
                              <TableCell>
                                {renderCell(item, columnKey.toString())}
                              </TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
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
