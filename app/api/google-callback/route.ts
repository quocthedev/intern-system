import APIClient from "@/libs/api-client";
import { apiEndpoints } from "@/libs/config";
import {
  LoginWithGoogleResponse,
  LoginWithGoogleResponseSuccess,
} from "@/libs/types";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    // console.error(error);
    // return Promise.reject(error);

    console.log(error.response.data);
  },
});

export async function GET(req: NextRequest) {
  ///GET google callback request

  const params = new URLSearchParams(req.url.split("?")[1]);

  const code = params.get("code");
  const { tokens } = await oauth2Client.getToken(code as string);

  const query = new URLSearchParams({
    GoogleIdToken: tokens.id_token as string,
  });

  const response = await apiClient.post<LoginWithGoogleResponse>(
    apiEndpoints.googleLogin + "?" + query,
  );

  if (response?.statusCode === "200") {
    const {
      data: { tokenString, expiresInMilliseconds, id, name, role },
    } = response as LoginWithGoogleResponseSuccess;

    // Create the session
    const expires = new Date(Date.now() + expiresInMilliseconds);

    // Save the session in a cookie
    cookies().set("accessToken", tokenString, { expires, httpOnly: true });
    cookies().set("userId", id, { expires, httpOnly: true });
    cookies().set("userName", name, { expires, httpOnly: true });
    cookies().set("userRole", role, { expires, httpOnly: true });
  }

  return NextResponse.redirect(new URL("/", req.nextUrl));
}
