"use client";
import React from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nextui-org/input";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../login/_component/Icon";
import { useToggle } from "usehooks-ts";
import { Button } from "@nextui-org/button";
import { API_ENDPOINTS } from "@/libs/config";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  // Example https://yourfrontend.com/reset-password?email=admin@gmail.com&token=eabfe389-0e18-4b21-8e33-7b4925a8fc36
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get email, token from query params

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [visible, toggleVisible] = useToggle();

  const resetPassword = useMutation({
    mutationFn: async (params: {
      email: string;
      token: string;
      newPassword: string;
    }) => {
      const res = await fetch(API_ENDPOINTS.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }).then((response) => response.json());

      if (res.statusCode === "200") {
        toast.success("Password reset successfully");
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    },
  });

  // If email or token is null, return an error message
  if (!email || !token) {
    return <div>Invalid reset password link</div>;
  }

  return (
    <div className="h-lvh bg-gradient-to-tl from-slate-300 to-blue-500">
      <div>
        <form
          className="flex min-h-screen w-full items-center justify-center"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);

            await resetPassword.mutateAsync({
              email,
              token,
              newPassword: formData.get("password") as string,
            });
          }}
        >
          <div className="relative flex w-[30%] flex-col items-center gap-3 rounded-xl bg-white p-10 shadow-xl">
            <div className="mb-3 text-center text-2xl font-semibold">
              Set new password
            </div>

            <Input
              label="Password"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Enter password"
              endContent={
                <button type="button" onClick={toggleVisible}>
                  {visible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                </button>
              }
              name="password"
              type={visible ? "text" : "password"}
              required
            />

            <Button
              variant="shadow"
              color="primary"
              className="w-full"
              type="submit"
            >
              Reset password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
