"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { CreateIcon } from "@/app/(dashboard)/intern/_components/Icons";
import { useRank } from "@/data-store/rank.store";
import { useRole } from "@/data-store/role.store";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { usePosition } from "@/data-store/position.store";
import SelectSearch, { SelectSearchItem } from "@/components/SelectSearch";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { BaseResponse } from "@/libs/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAccountContext } from "../_providers/AccountProvider";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

export default function CreateAccountModal() {
  const { refetchAccountList } = useAccountContext();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { data: rankData, setSearch: setRankSearch } = useRank({
    pageSize: 100,
  });

  const { data: roleData, setSearch: setRoleSearch } = useRole({
    pageSize: 100,
  });

  const [selectedRank, setSelectedRank] = useState<string>();
  const [selectedRole, setSelectedRole] = useState<string>();

  const {
    isLoading: isPositionsLoading,
    setSearch: setPositionSearch,
    dynamicPositionList,
    scrollerRef: positionScrollerRef,
    setIsOpen: setIsOpenPositionSearch,
    isOpen: isOpenPositionSearch,
  } = usePosition({ pageSize: 8 });

  const [selectedPositions, setSelectedPositions] = useState<
    Array<SelectSearchItem>
  >([]);

  const createAccount = useMutation({
    mutationFn: async (data: FormData) => {
      selectedPositions.forEach((position) => {
        data.append("PositionId", position.key);
      });
      data.append("RoleId", selectedRole || "");
      data.append("RankId", selectedRank || "");

      const res = await apiClient.post<BaseResponse<unknown>>(
        `${API_ENDPOINTS.user}`,
        data,
        {},
        true,
      );

      if (res.statusCode === "200") {
        toast.success("Account created successfully.");
        onClose();
        refetchAccountList();
        setSelectedPositions([]);
      } else {
        toast.error(res.message);
      }
    },
  });

  return (
    <>
      <Button
        color="primary"
        size="md"
        startContent={<CreateIcon />}
        className="text-white"
        variant="shadow"
        onPress={onOpen}
      >
        New Account
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-w-fit"
        as={"form"}
        action={createAccount.mutateAsync}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Account
              </ModalHeader>

              <ModalBody className="gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Full name"
                    placeholder="Enter intern full name"
                    labelPlacement="outside"
                    name="FullName"
                    required
                  />
                  <Input
                    label="Email"
                    placeholder="Enter email"
                    labelPlacement="outside"
                    type="email"
                    name="Email"
                    required
                  />

                  <Input
                    label="Username"
                    placeholder="Enter username"
                    labelPlacement="outside"
                    name="UserName"
                    required
                  />

                  <Autocomplete
                    label="Role"
                    placeholder="Choose role"
                    labelPlacement="outside"
                    defaultItems={roleData?.roles || []}
                    onSelectionChange={(value) =>
                      setSelectedRole(value?.toString())
                    }
                    required
                  >
                    {(role) => (
                      <AutocompleteItem key={role.id}>
                        {role.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  <Autocomplete
                    label="Rank"
                    placeholder="Choose rank"
                    labelPlacement="outside"
                    defaultItems={rankData?.ranks || []}
                    onSelectionChange={(value) =>
                      setSelectedRank(value?.toString())
                    }
                    // onInputChange={(value) => setRankSearch(value)}

                    required
                  >
                    {(rank) => (
                      <AutocompleteItem key={rank.id}>
                        {rank.name}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>

                  <SelectSearch
                    label="Positions"
                    placeholder="Select positions"
                    selectionMode="multiple"
                    isLoading={isPositionsLoading}
                    items={(dynamicPositionList || []).map((position) => ({
                      key: position.id,
                      value: position.name,
                      label: position.name,
                      chipLabel: position.abbreviation,
                    }))}
                    inputSearchPlaceholder="Search positions by name"
                    scrollRef={positionScrollerRef}
                    onSearchChange={setPositionSearch}
                    isOpen={isOpenPositionSearch}
                    setIsOpen={setIsOpenPositionSearch}
                    selectedItems={selectedPositions}
                    setSelectedItems={setSelectedPositions}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" className="w-full" type="submit">
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
