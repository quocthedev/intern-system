"use client";
import { Tab, Tabs } from "@nextui-org/tabs";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { detailId } = useParams();

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
    { key: "project", title: "Projects", href: "/projectUser" },
    // {
    //   key: "final-report",
    //   title: "Evaluation",
    //   href: "/final-report",
    // },
  ];
  const router = useRouter(); //use router to advoid reload entire page instead of using href
  const pathname = usePathname();

  const startPath = `/userCandidate/detail/${detailId}`;

  const activeTab =
    subRoutes.find((route) => pathname === `${startPath}${route.href}`)?.key ||
    "information";

  const handleTabChange = (key: string) => {
    const selectedRoute = subRoutes.find((route) => route.key === key);

    if (selectedRoute) {
      router.push(`${startPath}${selectedRoute.href}`);
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-3 p-6">
      <div className="text-xl font-semibold">Your profile</div>
      <Tabs
        aria-label="Options"
        radius="sm"
        color="primary"
        className="mt-3"
        selectedKey={activeTab}
        onSelectionChange={handleTabChange as any}
      >
        {subRoutes.map((route) => (
          <Tab
            key={route.key}
            title={route.title}
            // href={`${startPath}${route.href}`} replace with useRouter
          />
        ))}
      </Tabs>

      {children}
    </div>
  );
}
