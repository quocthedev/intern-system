"use client";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { Account } from "@/data-store/account/account-list.store";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { toast } from "sonner";
import { BaseResponse } from "@/libs/types";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { useRank } from "@/data-store/rank.store";
import { useRole } from "@/data-store/role.store";
import { useToggle } from "usehooks-ts";
import { cn } from "@nextui-org/react";
import { usePosition } from "@/data-store/position.store";
import SelectSearch, { SelectSearchItem } from "@/components/SelectSearch";
import { getCookie } from "@/app/util";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

export type AccountProfileProps = {
  accountId: any;
  accountData: Account;
  refetch: () => void;
};
export default function AccountProfile({
  accountId,
  accountData,
  refetch,
}: AccountProfileProps) {
  const { data: rankData, setSearch: setRankSearch } = useRank({
    pageSize: 100,
  });

  const { data: roleData, setSearch: setRoleSearch } = useRole({
    pageSize: 100,
  });

  const updateAccount = useMutation({
    mutationFn: async (data: FormData) => {
      const params = Object.fromEntries(data.entries()) as Record<
        string,
        unknown
      >;

      const rank = data.get("rank") as string;
      const role = data.get("role") as string;
      const rankId = rankData?.ranks.find((r) => r.name === rank)?.id;
      const roleId = roleData?.roles.find((r) => r.name === role)?.id;
      const updateAccountRes = await apiClient.put<BaseResponse<unknown>>(
        `${API_ENDPOINTS.user}/${accountId}`,
        {
          ...params,
          roleId: roleId,
        },
        {},
        true,
      );

      if (updateAccountRes.statusCode !== "200") {
        toast.error(updateAccountRes.message);

        return;
      }

      const updateRankRes = await apiClient.put<BaseResponse<unknown>>(
        `${API_ENDPOINTS.user}/${accountId}/rank`,
        rankId,
        {
          "Content-Type": "application/json",
        },
        true,
      );

      if (updateRankRes.statusCode !== "200") {
        toast.error(updateRankRes.message);

        return;
      }

      // Get added positions
      const removedPositions = accountData.jobTitle.positions.filter(
        (position: any) =>
          !selectedPositions.find((pos) => pos.key === position.id),
      );

      // Get removed positions
      const addedPositions = selectedPositions.filter(
        (position) =>
          !accountData.jobTitle.positions.find(
            (pos: any) => pos.id === position.key,
          ),
      );

      console.log(addedPositions, removedPositions);

      if (addedPositions.length > 0) {
        const addPostionsRes = await apiClient.post<BaseResponse<unknown>>(
          `${API_ENDPOINTS.user}/${accountId}/positions`,
          {
            positionIds: addedPositions.map((position: any) => position.key),
          },
          {},
          true,
        );

        if (addPostionsRes.statusCode !== "200") {
          toast.error(addPostionsRes.message);

          return;
        }
      }

      if (removedPositions.length > 0) {
        const removePositionsRes = await Promise.race(
          removedPositions.map((position: any) =>
            apiClient.delete<BaseResponse<unknown>>(
              `${API_ENDPOINTS.user}/${accountId}/remove-position?positionId=${position.id}`,
            ),
          ),
        );

        if (removePositionsRes.statusCode !== "200") {
          toast.error(removePositionsRes.message);

          return;
        }
      }

      toast.success("Account updated successfully.");

      refetch();
    },
  });

  const [editMode, toggleEditMode] = useToggle(false);

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
  >(
    (accountData?.jobTitle?.positions || []).map((position: any) => ({
      key: position.id,
      value: position.name,
      label: position.name,
      chipLabel: position.abbreviation,
    })),
  );

  const userRole = getCookie("userRole");

  return (
    <form
      className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-lg"
      action={async (data: FormData) => {
        await updateAccount.mutateAsync(data);
        toggleEditMode();
      }}
    >
      <div className="text-lg font-semibold">Personal Information</div>

      <Input
        defaultValue={accountData.fullName}
        variant={editMode ? "bordered" : "flat"}
        disabled={!editMode}
        name="fullName"
        label="Full Name"
        labelPlacement="outside"
      />

      <Input
        defaultValue={accountData.userName}
        variant={editMode ? "bordered" : "flat"}
        disabled={!editMode}
        name="userName"
        label="Username"
        labelPlacement="outside"
      />

      <Input
        defaultValue={accountData.email}
        variant={editMode ? "bordered" : "flat"}
        disabled={!editMode}
        type="email"
        name="email"
        label="Email"
        labelPlacement="outside"
      />

      <Input
        defaultValue={accountData.phone}
        variant={editMode ? "bordered" : "flat"}
        disabled={!editMode}
        name="phone"
        label="Phone Number"
        labelPlacement="outside"
      />

      <Input
        defaultValue={accountData.address}
        variant={editMode ? "bordered" : "flat"}
        disabled={!editMode}
        name="address"
        label="Address"
        labelPlacement="outside"
      />

      {userRole === "Administrator" ? (
        <div className="flex flex-col gap-3">
          <Autocomplete
            label="Role"
            placeholder="Choose role"
            labelPlacement="outside"
            defaultItems={roleData?.roles || []}
            defaultSelectedKey={accountData.role?.id || ""}
            isDisabled={!editMode}
            name="role"
          >
            {(role) => (
              <AutocompleteItem key={role.id}>{role.name}</AutocompleteItem>
            )}
          </Autocomplete>

          <Autocomplete
            label="Rank"
            placeholder="Choose rank"
            labelPlacement="outside"
            defaultItems={rankData?.ranks || []}
            defaultSelectedKey={accountData.jobTitle?.rank?.id || ""}
            name="rank"
            isDisabled={!editMode}
          >
            {(rank) => (
              <AutocompleteItem key={rank.id}>{rank.name}</AutocompleteItem>
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
            isDisabled={!editMode}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Autocomplete
            label="Role"
            placeholder="Choose role"
            labelPlacement="outside"
            defaultItems={roleData?.roles || []}
            defaultSelectedKey={accountData.role?.id || ""}
            isReadOnly
            name="role"
          >
            {(role) => (
              <AutocompleteItem key={role.id}>{role.name}</AutocompleteItem>
            )}
          </Autocomplete>
          <Autocomplete
            label="Rank"
            placeholder="Choose rank"
            labelPlacement="outside"
            defaultItems={rankData?.ranks || []}
            defaultSelectedKey={accountData.jobTitle?.rank?.id || ""}
            name="rank"
            isReadOnly
          >
            {(rank) => (
              <AutocompleteItem key={rank.id}>{rank.name}</AutocompleteItem>
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
            isDisabled
          />
        </div>
      )}

      <div className="flex gap-3">
        <Button
          color={"secondary"}
          className={cn(editMode && "hidden")}
          type="button"
          onPress={toggleEditMode}
        >
          Edit
        </Button>
        <Button
          color={"primary"}
          type="submit"
          isLoading={updateAccount.isPending}
          className={cn(!editMode && "hidden")}
        >
          Save
        </Button>
        <Button
          color={"default"}
          className={cn(!editMode && "hidden")}
          type="button"
          onPress={toggleEditMode}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
