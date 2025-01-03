import InformationAccountDetail from "@/app/(dashboard)/account/[accountId]/information/page";
import React from "react";

export default function AccountDetailPage() {
  return (
    <div className="p-6">
      <div className="mb-4 text-xl font-semibold">Profile Management</div>

      <div className="ml-24 mr-24 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <InformationAccountDetail />
      </div>
    </div>
  );
}
