"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/app/login/_component/Icon";
import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { login } from "@/actions/auth";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/libs/config";
import { cn } from "@nextui-org/react";

export const LoginForm = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const defaultSuccessMessage =
    "Reset password link has been sent to your email";
  const toggleVisible = () => {
    setVisible(!visible);
  };

  const [timer, setTimer] = useState(0);

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined = undefined;

    if (isDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsDisabled(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isDisabled, timer]);

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
        setIsDisabled(true);
        setTimer(60);
      } else {
        setResetPasswordMessage(res.message);
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await login(formData);

      if ("error" in res) {
        setErrorMessage(res.error);
      } else {
        Object.entries(res).forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });

        redirect("/");
      }
    },
  });

  enum Mode {
    Login = "login",
    ResetPassword = "reset-password",
  }

  const [mode, setMode] = useState(Mode.Login);

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
        action={
          {
            [Mode.Login]: loginMutation.mutateAsync,
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
                    isLoading={loginMutation.isPending}
                    type="submit"
                    color="primary"
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
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
                    isDisabled={resetPassword.isPending || isDisabled}
                    type="submit"
                    color="primary"
                  >
                    {resetPassword.isPending
                      ? "Processing..."
                      : isDisabled
                        ? `Retry in ${timer}s`
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
