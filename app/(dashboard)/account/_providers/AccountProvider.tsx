"use client";

import {
  Account,
  AccountListFilter,
  useAccountList,
} from "@/data-store/account/account-list.store";
import { createContext, useContext } from "react";

export interface AccountContextInterface {
  isAccountListLoading: boolean;
  accountListData:
    | {
        accounts: Account[];
        pageIndex: number;
        totalPages: number;
      }
    | undefined
    | null;
  refetchAccountList: () => void;
  setAccountListPageId: (pageId: number) => void;
  setAccountSearch: (search: string) => void;
  accountListFilter: AccountListFilter;
  setAccountListFilter: (newFilter: AccountListFilter | null) => void;
  removeOneAccountFilter: (key: keyof AccountListFilter) => void;
  removeAllAccountFilter: () => void;
}

const AccountContext = createContext<AccountContextInterface>(
  {} as AccountContextInterface,
);

export const useAccountContext = () => useContext(AccountContext);

export default function AccountProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isAccountListLoading,
    data: accountListData,
    refetch: refetchAccountList,
    setPageIndex: setAccountListPageId,
    setSearch: setAccountSearch,
    filter: accountListFilter,
    setFilter: setAccountListFilter,
    removeOneFilter: removeOneAccountFilter,
    removeAllFilter: removeAllAccountFilter,
  } = useAccountList({
    pageSize: 10,
  });

  return (
    <AccountContext.Provider
      value={{
        isAccountListLoading,
        accountListData,
        refetchAccountList,
        setAccountListPageId,
        setAccountSearch,
        accountListFilter,
        setAccountListFilter,
        removeOneAccountFilter,
        removeAllAccountFilter,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
