"use client";

import {
  ProjectSummary,
  useProjectSummary,
} from "@/data-store/project/project-summary";
import {
  ProjectTaskData,
  ProjectTaskFilter,
  useProjectTask,
} from "@/data-store/project/project-task.store";
import { useParams } from "next/navigation";
import { createContext, useContext } from "react";

export interface ProjectDetailContextInterface {
  isLoadingProjectTask: boolean;
  errorFetchingProjectTask: any;
  projectTasks: ProjectTaskData;
  refetchProjectTask: () => void;
  setProjectTaskPageIndex: (pageIndex: number) => void;
  setProjectTaskSearch: (search: string) => void;
  projectTaskFilter: ProjectTaskFilter | null;
  setProjectTaskFilter: (newFilter: ProjectTaskFilter) => void;
  removeOneProjectTaskFilter: (key: keyof ProjectTaskFilter) => void;
  removeAllProjectTaskFilter: () => void;
  isLoadingProjectSummary: boolean;
  errorFetchingProjectSummary: any;
  projectSummary: ProjectSummary | null | undefined;
  refetchProjectSummary: () => void;
  relatedUser?: RelatedUser[];
}

type RelatedUser = {
  id: string;
  name: string;
  role: string;
};

const ProjectDetailContext = createContext<ProjectDetailContextInterface>(
  {} as ProjectDetailContextInterface,
);

export const useProjectDetailContext = () => useContext(ProjectDetailContext);

export default function ProjectDetailProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const { project_id } = useParams();

  const {
    isLoading: isLoadingProjectTask,
    error: errorFetchingProjectTask,
    data: projectTasks,
    refetch: refetchProjectTask,
    setPageIndex: setProjectTaskPageIndex,
    setSearch: setProjectTaskSearch,
    filter: projectTaskFilter,
    setFilter: setProjectTaskFilter,
    removeOneFilter: removeOneProjectTaskFilter,
    removeAllFilter: removeAllProjectTaskFilter,
  } = useProjectTask({
    pageSize: 10,
    projectId: project_id as string,
  });

  const {
    isLoading: isLoadingProjectSummary,
    error: errorFetchingProjectSummary,
    data: projectSummary,
    refetch: refetchProjectSummary,
  } = useProjectSummary({
    projectId: project_id as string,
  });

  const relatedUser = projectSummary?.groupUserRelated.reduce((acc, group) => {
    const usersWithRole = group.users.map((user) => ({
      ...user,
      name: user.fullName,
      role: group.role,
      id: user.id, // Ensure id is a number
    }));

    return [...acc, ...usersWithRole];
  }, [] as RelatedUser[]);

  return (
    <ProjectDetailContext.Provider
      value={{
        isLoadingProjectTask,
        errorFetchingProjectTask,
        projectTasks,
        refetchProjectTask,
        setProjectTaskPageIndex,
        setProjectTaskSearch,
        projectTaskFilter,
        setProjectTaskFilter,
        removeOneProjectTaskFilter,
        removeAllProjectTaskFilter,
        isLoadingProjectSummary,
        errorFetchingProjectSummary,
        projectSummary,
        refetchProjectSummary,
        relatedUser,
      }}
    >
      {children}
    </ProjectDetailContext.Provider>
  );
}
