import React from "react";
import SideBar from "./_components/sidebar/SideBar";
import { cookies } from "next/headers";

export type DashBoardLayoutProps = {
  children: React.ReactNode;
};

export default function DashBoardLayout(props: DashBoardLayoutProps) {
  const cookiesStore = cookies();

  const role = cookiesStore.get("userRole")?.value as string;

  if (role !== "Candidate")
    return (
      <main className="flex h-screen w-screen bg-dashboard-bg">
        <SideBar />
        <div className="h-full w-full overflow-scroll rounded-3xl bg-white">
          {props.children}
        </div>
      </main>
    );
  else
    return (
      <main className="flex h-screen w-screen flex-col bg-dashboard-bg">
        <SideBar />
        <div className="flex h-full w-full justify-center overflow-scroll bg-white">
          <div className="ml-10 mr-10 h-full w-full"> {props.children}</div>
        </div>
      </main>
    );
}
