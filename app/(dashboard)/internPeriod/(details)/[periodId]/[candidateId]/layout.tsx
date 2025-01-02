"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { candidateId } = useParams();

  const subRoutes = [
    {
      key: "information",
      title: "Information",
      href: "/",
    },
    {
      key: "cv",
      title: "CV",
      href: "/cv",
    },
    {
      key: "interview-information",
      title: "Interview Information",
      href: "/interview-information",
    },
    {
      key: "final-report",
      title: "Evaluation",
      href: "/final-report",
    },
  ];

  const pathname = usePathname();

  const startPath = `/internPeriod/details/${candidateId}`;

  let activeTab;

  if (pathname === startPath) {
    activeTab = "information";
  } else {
    activeTab =
      pathname.replace(startPath, "") === ""
        ? "information"
        : pathname.replace(startPath, "").replace("/", "");
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-3 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <div className="flex items-center">
            <Link
              href="/internPeriod"
              className="bold font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              Intern period management
            </Link>
            <span className="mx-2"> &gt; </span>
            <span className="font-semibold"> Candidate detail </span>
          </div>
        </div>

        <Tabs
          aria-label="Options"
          radius="sm"
          color="primary"
          className="mt-3"
          selectedKey={activeTab}
        >
          {subRoutes.map((route) => (
            <Tab
              key={route.key}
              title={route.title}
              href={`${startPath}${route.href}`}
            />
          ))}
        </Tabs>

        {children}
      </div>
    </>
  );
}
