"use client";

import {
  ProjectListData,
  ProjectListFilter,
  useProjectList,
} from "@/data-store/project/project-list.store";

import { createContext, useContext } from "react";

export interface ProjectListContextInterface {
  isLoadingProjectList: boolean;
  errorFetchingProjectList: any;
  projectList: ProjectListData;
  refetchProjectList: () => void;
  setProjectListPageIndex: (pageIndex: number) => void;
  setProjectListSearch: (search: string) => void;
  projectListFilter: ProjectListFilter;
  setProjectListFilter: (newFilter: ProjectListFilter) => void;
  removeOneProjectListFilter: (key: keyof ProjectListFilter) => void;
  removeAllProjectListFilter: () => void;
}

const ProjectListContext = createContext<ProjectListContextInterface>(
  {} as ProjectListContextInterface,
);

export const useProjectListContext = () => useContext(ProjectListContext);

export default function ProjectListProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const {
    isLoading: isLoadingProjectList,
    error: errorFetchingProjectList,
    data: projectList,
    refetch: refetchProjectList,
    setPageIndex: setProjectListPageIndex,
    setSearch: setProjectListSearch,
    filter: projectListFilter,
    setFilter: setProjectListFilter,
    removeOneFilter: removeOneProjectListFilter,
    removeAllFilter: removeAllProjectListFilter,
  } = useProjectList({
    pageSize: 6,
  });

  return (
    <ProjectListContext.Provider
      value={{
        isLoadingProjectList,
        errorFetchingProjectList,
        projectList,
        refetchProjectList,
        setProjectListPageIndex,
        setProjectListSearch,
        projectListFilter,
        setProjectListFilter,
        removeOneProjectListFilter,
        removeAllProjectListFilter,
      }}
    >
      {children}
    </ProjectListContext.Provider>
  );
}
