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
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { Autocomplete } from "@nextui-org/autocomplete";
import { useParams } from "next/navigation";
import { useProjectDetailContext } from "@/app/(dashboard)/project/_providers/ProjectDetailProvider";
import { AddIcon } from "@/app/(dashboard)/project/_components/Icons";
import { Spinner } from "@nextui-org/react";

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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [roleMapping, setRoleMapping] = React.useState<Record<string, string>>(
    {},
  );

  // const { data: positionData, isLoading: isPositionLoading } = usePosition({
  //   pageSize: 100,
  // });

  const { projectSummary, isLoadingProjectSummary, refetchProjectSummary } =
    useProjectDetailContext();

  const [positionFilter, setPositionFilter] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { project_id } = useParams();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["members", positionFilter, search, project_id],
    queryFn: async () => {
      const response = await apiClient.get<GetCandidateUsersResponse>(
        `${API_ENDPOINTS.project}/${project_id}/user-related-position`,
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
    const candidates = Array.from(selectedKeys).map((key) => ({
      userId: key,
      role: Number(roleMapping[key] || "3"),
    }));

    setLoading(true);
    const res = await addNewMembers(props.projectId, candidates);

    console.log(res);

    if (res.statusCode !== "200") {
      toast.error(res.message);
      return;
    }

    toast.success("New members added successfully");
    refetchProjectSummary();
    onClose();
    setLoading(false);
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
      key: "1",
      name: "Leader",
    },
    {
      key: "2",
      name: "Subleader",
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
              setRoleMapping((prev) => ({
                ...prev,
                [item.id]: selectedKeys.currentKey as string,
              }));
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

  const positionOptions = (projectSummary?.listPosition ?? []).map(
    (position) => ({
      value: position.id,
      label: position.name,
    }),
  );

  return (
    <>
      <Button onPress={onOpen} color="primary" variant="shadow">
        <AddIcon /> Add New Member
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="max-w-4xl">
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
                <Button color="primary" fullWidth onPress={submitAddNewMembers}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      Assigning <Spinner color="white" size="sm" />
                    </div>
                  ) : (
                    "Assign"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
