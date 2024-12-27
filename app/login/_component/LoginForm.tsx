"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  GoogleIcon,
} from "@/app/login/_component/Icon";
import { Button } from "@nextui-org/button";
import { redirect, useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { cn } from "@nextui-org/react";

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

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const defaultSuccessMessage =
    "Reset password link has been sent to your email";
  const toggleVisible = () => {
    setVisible(!visible);
  };

  const loginWithGoogle = () => {
    const query = {
      client_id: oauth_google.client_id,
      redirect_uri: oauth_google.redirect_uri,
      response_type: "code",
      scope: oauth_google.scopes,
    };
    const url = new URL(oauth_google.endpoint);

    url.search = new URLSearchParams(query).toString();
    window.location.href = url.toString();
  };

  // create a mutation to reset the password
  const resetPassword = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(API_ENDPOINTS.requestResetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((response) => response.json());

      if (res.statusCode === "200") {
        setResetPasswordMessage(defaultSuccessMessage);
      } else {
        setResetPasswordMessage(res.message);
      }
    },
  });

  enum Mode {
    Login = "login",
    ResetPassword = "reset-password",
  }

  const [mode, setMode] = useState(Mode.Login);

  const submitLogin = async (formData: FormData) => {
    const result = await login(formData);

    if ("error" in result) {
      setErrorMessage(result.error);
      setIsLoading(false);
    } else {
      // Set user info to the local storage
      Object.entries(result).forEach(([key, value]) => {
        setIsLoading(false);
        window.localStorage.setItem(key, value);
      });

      redirect("/");
    }
  };

  const [resetPasswordMessage, setResetPasswordMessage] = useState("");

  const submitResetPassword = async (formData: FormData) => {
    const res = await resetPassword.mutateAsync(
      formData.get("email") as string,
    );

    console.log(res);
  };

  return (
    <div>
      <form
        className="flex min-h-screen w-full items-center justify-center"
        onSubmit={() => setIsLoading(true)}
        action={
          {
            [Mode.Login]: submitLogin,
            [Mode.ResetPassword]: submitResetPassword,
          }[mode]
        }
      >
        <div className="relative flex w-[30%] flex-col gap-3 rounded-xl bg-white p-10 shadow-xl">
          <div className="mb-3 text-center text-2xl font-semibold">
            {
              {
                [Mode.Login]: "Welcome to InternS",
                [Mode.ResetPassword]: "Reset password",
              }[mode]
            }
          </div>
          {
            {
              [Mode.Login]: (
                <>
                  <Input
                    type="email"
                    label="Email"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="example@mail.com"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errorMessage && (
                    <div className="text-red-500">{errorMessage}</div>
                  )}

                  <Button
                    isLoading={isLoading}
                    isDisabled={isLoading}
                    type="submit"
                    color="primary"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>

                  <div className="mt-2 w-full">
                    <hr className="h-0.5 w-full bg-gray-300" />
                    <p className="z-10 mx-auto -mt-3 w-fit bg-white px-3 text-center text-gray-300">
                      OR
                    </p>
                  </div>

                  <Button
                    variant="bordered"
                    startContent={<GoogleIcon />}
                    onPress={() => loginWithGoogle()}
                  >
                    Sign in with Google
                  </Button>
                  <Button
                    className="font-medium text-blue-500 underline underline-offset-4"
                    variant="light"
                    onPress={() => setMode(Mode.ResetPassword)}
                  >
                    Forgot password?
                  </Button>
                </>
              ),
              [Mode.ResetPassword]: (
                <>
                  <Button
                    className="hover:none absolute text-blue-500"
                    isIconOnly
                    onClick={() => {
                      setMode(Mode.Login);

                      setResetPasswordMessage("");
                    }}
                    color="primary"
                    variant="light"
                  >
                    く
                  </Button>

                  <Input
                    type="email"
                    label="Email"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="example@mail.com"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {resetPasswordMessage && (
                    <p
                      className={cn(
                        "text-sm",
                        resetPasswordMessage === defaultSuccessMessage
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    >
                      {resetPasswordMessage}
                    </p>
                  )}

                  <Button
                    isLoading={resetPassword.isPending}
                    isDisabled={resetPassword.isPending}
                    type="submit"
                    color="primary"
                  >
                    {resetPassword.isPending
                      ? "Processing..."
                      : "Reset password"}
                  </Button>
                </>
              ),
            }[mode]
          }
        </div>
      </form>
    </div>
  );
};
