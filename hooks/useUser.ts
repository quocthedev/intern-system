import { UserInfo } from "@/actions/auth";
import { create } from "zustand";

type UserState = {
  id: string;
  name: string;
  role: string;
};

type UserStateAction = {
  setUser: (user: UserInfo) => void;
};

export const useUser = create<UserState & UserStateAction>((set) => {
  // Get the user info from the local storage
  //HACK: make sure window is defined
  const localStorage =
    typeof window !== "undefined" ? window.localStorage : null;

  const user = {
    id: localStorage?.getItem("id") || "",
    name: localStorage?.getItem("name") || "",
    role: localStorage?.getItem("role") || "",
  };

  return {
    ...user,
    setUser: (user) => set(user),
  };
});
