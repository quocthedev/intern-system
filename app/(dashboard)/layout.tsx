import React from "react";
import SideBar from "./_components/sidebar/SideBar";
import { ToastContainer } from "react-toastify";

export type DashBoardLayoutProps = {
  children: React.ReactNode;
};

export default function DashBoardLayout(props: DashBoardLayoutProps) {
  return (
    <main className="flex h-screen w-screen bg-dashboard-bg">
      <SideBar />
      <div className="h-full w-full overflow-scroll rounded-3xl bg-white">
        {props.children}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </main>
  );
}
