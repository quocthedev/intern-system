import axios, { AxiosInstance } from "axios";

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

  async get<ResponseType>(url: string, config = {}): Promise<ResponseType> {
    const response = await this.client.get(url, config);

    return response.data as ResponseType;
  }

  async post<ResponseType>(
    url: string,
    data = {},
    headers = {},
  ): Promise<ResponseType> {
    // If auth is true, add the Authorization header to the request by using the access token stored in cookies

    const config = {
      headers,
    };

    const response = await this.client.post<ResponseType>(url, data, config);

    return response.data as ResponseType;
  }
}
