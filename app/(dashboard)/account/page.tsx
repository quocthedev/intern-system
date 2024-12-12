import React from "react";
import ActionBar from "./_components/ActionBar";
import AccountProvider from "./_providers/AccountProvider";
import AccountTable from "./_components/AccountTable";

export default function AccountPage() {
  return (
    <AccountProvider>
      <div className="flex flex-col gap-3 p-9">
        <p className="text-2xl font-semibold">Account Management</p>
        <ActionBar />
        <AccountTable />
      </div>
    </AccountProvider>
  );
}
