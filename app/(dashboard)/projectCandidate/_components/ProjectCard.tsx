import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Chip } from "@nextui-org/chip";
import { PropsWithChildren } from "react";
import { useDisclosure } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { Project } from "@/data-store/project/project-list-candidate.store";

export default function ProjectCard(props: PropsWithChildren<Project>) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <Card
      key={props.id}
      className="hover:translate-y-1"
      isPressable
      onPress={() => router.push(`/project/${props.id}` as string)}
    >
      <CardHeader className="flex gap-1">
        <div className="flex w-full justify-between">
          <p className="text-lg font-semibold">{props.title}</p>
          <div className="flex items-center gap-1">
            <Chip className="bg-warning-400/50 text-warning-700" size="sm">
              {props.status}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Position:</p>
            <p>
              {props.listPosition?.map((position) => position.name).join(", ")}
            </p>
          </div>
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Technology:</p>
            <p>
              {props.listTechnology
                ?.map((technology) => technology.name)
                .join(", ")}
            </p>
          </div>
          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Leader:</p>
            <p>
              {props.groupUserRelated
                ?.find((group) => group.role === "Leader")
                ?.users.map((user) => user.fullName)
                .join(", ")}
            </p>
          </div>

          <div className="flex gap-1 text-xs">
            <p className="font-semibold">Sub Leader:</p>
            <p>
              {props.groupUserRelated
                ?.find((group) => group.role === "SubLeader")
                ?.users.map((user) => user.fullName)
                .join(", ")}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <p className="font-semibold">Zalo Group:</p>
            <Link href={props.zaloUri} isExternal className="text-xs">
              {props.zaloUri}
            </Link>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex w-full justify-between">
          <p className="text-xs text-success-400">
            Start On: {props.startDate.split("T")[0]}
          </p>
          <p className="text-xs text-danger-400">
            Release On: {props.releaseDate.split("T")[0]}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
