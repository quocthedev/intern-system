"use client";
import { Input } from "@nextui-org/input";
import React from "react";
import { useAccountContext } from "../_providers/AccountProvider";
import CreateAccountModal from "./CreateAccountModal";
import { useRank } from "@/data-store/rank.store";
import { useRole } from "@/data-store/role.store";
import { usePosition } from "@/data-store/position.store";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

export default function ActionBar() {
  const { setAccountSearch, setAccountListFilter, accountListFilter } =
    useAccountContext();

  const { data: rankData } = useRank({
    pageSize: 100,
  });

  const { data: roleData } = useRole({
    pageSize: 100,
  });

  const { data: positionData } = usePosition({ pageSize: 100 });

  return (
    <div>
      <Input
        size="md"
        placeholder="Search by name, mentor, technology,..."
        className="flex-1"
        fullWidth
        onChange={(e) => setAccountSearch(e.target.value)}
      />
      <div className="mt-3 flex w-full justify-between gap-3">
        <div className="flex w-[60%] gap-3">
          <Autocomplete
            placeholder="Filter by role"
            labelPlacement="outside"
            defaultItems={roleData?.roles || []}
            onSelectionChange={(value) =>
              setAccountListFilter(
                Object.assign({}, accountListFilter, {
                  RoleId: value?.toString() || "",
                }),
              )
            }
            required
          >
            {(role) => (
              <AutocompleteItem key={role.id}>{role.name}</AutocompleteItem>
            )}
          </Autocomplete>

          <Autocomplete
            placeholder="Filter by rank"
            labelPlacement="outside"
            defaultItems={rankData?.ranks || []}
            onSelectionChange={(value) =>
              setAccountListFilter(
                Object.assign({}, accountListFilter, {
                  RankId: value?.toString() || "",
                }),
              )
            }
            // onInputChange={(value) => setRankSearch(value)}

            required
          >
            {(rank) => (
              <AutocompleteItem key={rank.id}>{rank.name}</AutocompleteItem>
            )}
          </Autocomplete>

          <Autocomplete
            placeholder="Filter by position"
            labelPlacement="outside"
            defaultItems={positionData?.positions || []}
            onSelectionChange={(value) =>
              setAccountListFilter(
                Object.assign({}, accountListFilter, {
                  PositionId: value?.toString() || "",
                }),
              )
            }
            className="max"
            // onInputChange={(value) => setRankSearch(value)}

            required
          >
            {(position) => (
              <AutocompleteItem key={position.id}>
                {position.name}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>

        <CreateAccountModal />
      </div>
    </div>
  );
}
