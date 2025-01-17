"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

import { Chip, ChipProps } from "@nextui-org/chip";
import React, { useState } from "react";
import { Tooltip } from "@nextui-org/tooltip";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import Link from "next/link";
import { useAccountContext } from "../_providers/AccountProvider";
import { Pagination } from "@nextui-org/pagination";
import Loading from "@/components/Loading";
import { DeleteIcon, ViewIcon } from "../../internPeriod/_components/Icons";

export type Account = {
  fullName: string;
  email: string;
  userName: string;
  gender: string;
  phone: string;
  address: string;
  status: string;
  isActive: boolean;
  role: any;
  jobTitle: any;
  id: string;
  dateCreate: string;
  dateUpdate: string;
  isDeleted: boolean;
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  Online: "success",
  Offline: "danger",
};

export default function AccountTable() {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    isAccountListLoading,
    accountListData,
    refetchAccountList,
    setAccountListPageId,
  } = useAccountContext();

  const { accounts, totalPages, pageIndex } = accountListData || {};

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(API_ENDPOINTS.user + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json());

      if (res.statusCode !== "200") {
        toast.error(res.message);

        return;
      }

      toast.success("Deleted account successfully!");
      refetchAccountList();
    },
  });

  const handleDeleteConfirmation = (id: string) => {
    setSelectedAccount(id);
    onOpen();
  };

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(selectedAccount as string);
    onClose();
  };

  const columns = [
    { key: "no", label: "NO" },
    { key: "fullName", label: "FULL NAME" },
    { key: "email", label: "EMAIL" },
    { key: "userName", label: "USERNAME" },
    { key: "gender", label: "GENDER" },
    { key: "phone", label: "PHONE" },
    // { key: "address", label: "ADDRESS" },
    { key: "status", label: "STATUS" },
    { key: "role", label: "ROLE" },
    { key: "jobTitle", label: "POSITION" },
    { key: "rank", label: "RANK" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = React.useCallback(
    (account: Account, columnKey: React.Key, index: number) => {
      const cellValue = account[columnKey as keyof Account];

      switch (columnKey) {
        case "no":
          return <div className="text-center text-xs">{index + 1}</div>;
        case "fullName":
          return <div className="text-xs">{account.fullName}</div>;
        case "email":
          return <div className="text-xs">{account.email}</div>;
        case "userName":
          return <div className="text-xs">{account.userName}</div>;
        case "gender":
          return <div className="text-xs">{account.gender}</div>;
        case "phone":
          return <div className="text-xs">{account.phone}</div>;
        case "role":
          return <div className="text-xs">{account.role?.name}</div>;
        case "jobTitle":
          return (
            <div className="text-xs">
              {account.jobTitle.positions.map(
                (position: any, index: number) => (
                  <span key={position.id}>
                    {position.name}
                    {index < account.jobTitle.positions.length - 1 && ", "}
                  </span>
                ),
              )}
            </div>
          );
        case "rank":
          return <div className="text-xs">{account.jobTitle?.rank?.name}</div>;
        case "status":
          return (
            <div className="text-xs">
              <Chip color={statusColorMap[account.status]} variant="flat">
                {account.status}
              </Chip>
            </div>
          );
        case "actions":
          return (
            <div className="flex items-center">
              <Tooltip content="View detail">
                <Link href={`account/${account.id}`}>
                  <Button isIconOnly variant="light">
                    <ViewIcon />
                  </Button>
                </Link>
              </Tooltip>

              <Tooltip content="Delete">
                <Button
                  onClick={() => {
                    handleDeleteConfirmation(account.id);
                  }}
                  isIconOnly
                  variant="light"
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={accounts || []}
          isLoading={isAccountListLoading}
          loadingContent={<Loading />}
        >
          {(account: Account) => (
            <TableRow key={account.id}>
              {(columnKey: React.Key) => (
                <TableCell key={columnKey}>
                  {renderCell(
                    account,
                    columnKey,
                    accounts?.indexOf(account) || 0,
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pageIndex ? (
        <Pagination
          isCompact
          loop
          showControls
          total={Number(totalPages) || 1}
          initialPage={Number(pageIndex) || 1}
          onChange={(page) => {
            setAccountListPageId(page);
          }}
        />
      ) : (
        <></>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-fit">
        <ModalContent>
          <ModalBody className="mt-4 text-center">
            <p>Are you sure you want to delete this Account?</p>
            <div className="mt-5 grid grid-cols-2 gap-5">
              <Button color="primary" onClick={confirmDelete}>
                Yes
              </Button>
              <Button onClick={onClose} color="default">
                No
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
