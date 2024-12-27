"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import APIClient from "@/libs/api-client";
import { API_ENDPOINTS } from "@/libs/config";
import { Account } from "@/data-store/account/account-list.store";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import AccountProfile from "../_components/AccountProfile";

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_ENDPOINTS.user}/${accountId}/upload-avatar`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      refetch();
      toast.success("Avatar change successfully!");
    } catch (error) {
      toast.error("Error changing avatar");
      console.error(error);
    }
  };

  useEffect(() => {
    handleUpload();
  }, [selectedFile]);

  return isLoading ? (
    <Loading />
  ) : (
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
              <div className="mb-4 text-gray-600">Please choose picture</div>
              <Button
                onPress={() => document.getElementById("uploadImage")?.click()}
                color="primary"
                size="md"
              >
                Change Avatar
              </Button>

              <input
                id="uploadImage"
                type="file"
                accept=".png"
                onChange={handleFileChange}
                hidden
              />
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <AccountProfile
          accountData={accountData}
          refetch={refetch}
          accountId={accountId}
        />

        {/* Security Section */}
        {/* <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-8 text-lg font-semibold">Change Password</h3>
          <PasswordChangeFormRefactor />
        </div> */}
      </div>
    </div>
  );
}
