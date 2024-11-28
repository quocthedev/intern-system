"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  GoogleIcon,
} from "@/app/login/_component/Icon";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { redirect, useRouter } from "next/navigation";
import { login } from "@/actions/auth";

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

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-[30%] rounded-xl bg-white p-10 shadow-xl">
          <div className="mb-10 text-center text-2xl font-semibold">
            Welcome to InternS!
          </div>

          <form
            onSubmit={() => setIsLoading(true)}
            action={async (formData) => {
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
            }}
          >
            <Input
              type="email"
              label="Email"
              variant="bordered"
              labelPlacement="outside"
              className="mb-10"
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
              <div className="mb-4 text-red-500">{errorMessage}</div>
            )}

            {/* <div className="mt-4">
              <Checkbox defaultSelected size="md"></Checkbox>
              <span className="-ml-1 mr-20 mt-0.5 text-xs">Remember me</span>
              <span className="mt-0.5 text-xs text-blue-500">
                Forgot password?
              </span>
            </div> */}

            <Button
              isLoading={isLoading}
              isDisabled={isLoading}
              type="submit"
              className="mt-4 w-[100%]"
              color="primary"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="flex justify-center">
            <hr className="mt-6 h-0.5 w-44 bg-gray-300" />
            <p className="ml-1 mr-1 mt-3 text-gray-300">OR</p>
            <hr className="mt-6 h-0.5 w-44 bg-gray-300" />
          </div>

          <Button
            className="mt-4 w-[100%]"
            variant="bordered"
            startContent={<GoogleIcon />}
            onPress={() => loginWithGoogle()}
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    </>
  );
};
