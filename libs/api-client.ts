import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export default class APIClient {
  readonly client: AxiosInstance;

  constructor(interceptors?: {
    onFulfilled?: (response: any) => any;
    onRejected?: (error: any) => any;
  }) {
    this.client = axios.create({
      baseURL: API_BASE_URL,
    });

    this.client.interceptors.response.use(
      interceptors?.onFulfilled || ((response) => response),
      interceptors?.onRejected || ((error) => Promise.reject(error)),
    );
  }

  async get<ResponseType>(
    url: string,
    config: AxiosRequestConfig = {},
    auth: boolean = false,
  ): Promise<ResponseType> {
    if (auth) {
      let accessToken: string | null;

      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        // Add the Authorization header

        accessToken = cookies().get("accessToken")?.value || null;
      } else {
        accessToken = (await getCookie("accessToken")) || null;
      }

      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    const response = await this.client.get(url, config);

    return response.data as ResponseType;
  }

  async post<ResponseType>(
    url: string,
    data = {},
    headers = {},
    auth = false,
  ): Promise<ResponseType> {
    // If auth is true, add the Authorization header to the request by using the access token stored in cookies

    const config = {
      headers,
    };

    if (auth) {
      const { cookies } = await import("next/headers");
      // Add the Authorization header
      const accessToken = cookies().get("accessToken")?.value;

      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    const response = await this.client.post<ResponseType>(url, data, config);

    return response.data as ResponseType;
  }

  async put<ResponseType>(
    url: string,
    data = {},
    headers = {},
    auth = false,
  ): Promise<ResponseType> {
    // If auth is true, add the Authorization header to the request by using the access token stored in cookies

    const config = {
      headers,
    };

    if (auth) {
      const { cookies } = await import("next/headers");
      // Add the Authorization header
      const accessToken = cookies().get("accessToken")?.value;

      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    const response = await this.client.put<ResponseType>(url, data, config);

    return response.data as ResponseType;
  }

  async delete<ResponseType>(
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<ResponseType> {
    const response = await this.client.delete(url, config);

    return response.data as ResponseType;
  }
}
