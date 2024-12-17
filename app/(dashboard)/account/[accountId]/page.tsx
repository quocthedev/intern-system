import InformationAccountDetail from "@/app/(dashboard)/account/[accountId]/information/page";
import { PasswordChangeForm } from "@/app/(dashboard)/password-change/_components/PasswordChangeForm";
import Link from "next/link";
import React from "react";

export default function AccountDetailPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <div className="flex items-center">
          <Link
            href="/account"
            className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Account management
          </Link>
          <span className="mx-2"> &gt; </span>
          <span className="font-semibold"> Account detail </span>
        </div>
      </div>
      <InformationAccountDetail />
    </div>
  );
}
