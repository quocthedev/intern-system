"use server";
import {
  LoginResponse,
  LoginResponseFailed,
  LoginResponseSuccess,
} from "@/libs/types";
import { apiEndpoints } from "@/libs/config";
import { cookies } from "next/headers";
import APIClient from "@/libs/api-client";

const apiClient = new APIClient(
  // Add a response interceptor to handle errors
  {
    onRejected: (error) => {
      console.log(error);
      throw new Error(error);
    },
  },
);

export type UserInfo = {
  id: string;
  name: string;
  role: string;
};

export async function login(formData: FormData): Promise<
  | UserInfo
  | {
      error: string;
    }
> {
  // Verify credentials && get the user

  const user = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const response = await apiClient.post<LoginResponse>(
    apiEndpoints.login,
    user,
  );

  if (response?.statusCode === "200") {
    const {
      data: { tokenString, expiresInMilliseconds, id, name, role },
    } = response as LoginResponseSuccess;

    // Create the session
    const expires = new Date(Date.now() + expiresInMilliseconds);

    // Save the session in a cookie
    cookies().set("accessToken", tokenString, { expires, httpOnly: true });

    cookies().set("userId", id, { expires, httpOnly: true });
    cookies().set("userName", name, { expires, httpOnly: true });
    cookies().set("userRole", role, { expires, httpOnly: true });

    return {
      id,
      name,
      role,
    };
  } else {
    return {
      error: (response as LoginResponseFailed).message,
    };
  }
}

export async function logout() {
  // Destroy the session
  cookies().delete("accessToken");
}
