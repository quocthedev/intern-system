"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/app/login/_component/Icon";
import { Button } from "@nextui-org/button";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { toast } from "sonner";
import APIClient from "@/libs/api-client";
import { BaseResponse } from "@/libs/types";

type GOOGLE_AUTH_KEYS =
  | "client_id"
  | "client_secret"
  | "endpoint"
  | "redirect_uri"
  | "scopes";

export const oauth_google: Record<GOOGLE_AUTH_KEYS, string> = {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || "",
  client_secret: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_SECRET || "",
  endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI || "",
  scopes:
    "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
};

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    return {
      data: error.response.data,
    };
  },
});

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export const PasswordChangeFormRefactor = () => {
  const [visible, setVisible] = useState(false);
  const defaultSuccessMessage = "Password changed successfully.";
  const toggleVisible = () => {
    setVisible(!visible);
  };

  // create a mutation to reset the password
  const changePassword = useMutation({
    mutationFn: async (params: ChangePasswordBody) => {
      const res = await apiClient.post<BaseResponse<unknown>>(
        `${API_ENDPOINTS.user}/change-password`,
        params,
        {},
        true,
      );

      if (res.statusCode === "200") {
        toast.success(defaultSuccessMessage);
      } else {
        toast.error(res.message);
      }
    },
  });

  const [notification, setNotification] = useState("");

  const submitChangePassword = async (formData: FormData) => {
    const params = Object.fromEntries(formData.entries()) as ChangePasswordBody;

    await changePassword.mutateAsync(params);
  };

  return (
    <div>
      <form action={submitChangePassword}>
        <Input
          label="Current Password"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Enter current password"
          endContent={
            <button type="button" onClick={toggleVisible}>
              {visible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
            </button>
          }
          name="currentPassword"
          type={visible ? "text" : "password"}
          required
          className="mb-8"
        />

        <Input
          label="New Password"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Enter new password"
          endContent={
            <button type="button" onClick={toggleVisible}>
              {visible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
            </button>
          }
          name="newPassword"
          type={visible ? "text" : "password"}
          required
          className="mb-8"
        />

        <Input
          label="Confirm Password"
          labelPlacement="outside"
          variant="bordered"
          placeholder="Confirm password"
          endContent={
            <button type="button" onClick={toggleVisible}>
              {visible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
            </button>
          }
          name="confirmPassword"
          type={visible ? "text" : "password"}
          required
          className="mb-4"
        />

        <Button
          isLoading={changePassword.isPending}
          type="submit"
          color="primary"
        >
          {changePassword.isPending ? "Processing..." : "Change password"}
        </Button>
      </form>
    </div>
  );
};
