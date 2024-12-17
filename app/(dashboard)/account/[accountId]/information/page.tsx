"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { Account } from "@/data-store/account/account-list.store";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { PasswordChangeFormRefactor } from "@/app/(dashboard)/password-change/_components/PasswordChangeForm_refactor";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);

    return {
      data: { error: error.response.data.message },
    };
  },
});

export default function InformationAccountDetail() {
  const params = useParams();
  const accountId = params.accountId as string;

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["account", accountId],
    queryFn: async () => {
      const response = (await apiClient.get<Account>(
        `${API_ENDPOINTS.user}/${accountId}`,
      )) as any;

      return response;
    },
  });

  const accountData = data?.data || {};

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="h-full w-full bg-gray-100">
      <div className="p-6">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold">Avatar</h3>
          <div className="flex items-center space-x-4">
            {accountData?.avatar ? (
              <Image
                width={150}
                height={150}
                alt={`${accountData.name}`}
                src={accountData.avatar}
                className="rounded-2xl object-contain"
              />
            ) : (
              <Image
                width={150}
                height={150}
                alt="Default Candidate"
                src="/icons/technology/no-avatar.png"
                className="rounded-2xl object-contain"
              />
            )}
            <div>
              <input type="file" className="mb-2 rounded border p-2" />
              <p className="text-sm text-gray-500">Please choose picture</p>
              <button className="mt-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">
                Change avatar
              </button>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="space-y-4">
            <div>
              <div className="mb-1 font-medium">Full Name</div>
              <Input value={accountData.fullName} variant="bordered" />
            </div>
            <div>
              <div className="mb-1 font-medium">Email</div>
              <Input value={accountData.email} variant="bordered" />
            </div>
            <div>
              <div className="mb-1 font-medium">Email</div>
              <Input value={accountData.email} variant="bordered" />
            </div>
            <div>
              <div className="mb-1 font-medium">Email</div>
              <Input value={accountData.email} variant="bordered" />
            </div>
            <Button color="success">Edit profile</Button>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-8 text-lg font-semibold">Change Password</h3>
          <PasswordChangeFormRefactor />
        </div>
      </div>
    </div>
  );
}
