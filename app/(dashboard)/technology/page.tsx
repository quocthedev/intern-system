import ActionBar from "@/app/(dashboard)/technology/_components/ActionBar";
import { TechCard } from "@/app/(dashboard)/technology/_components/TechCard";
import TechnologyProvider from "@/app/(dashboard)/technology/_providers/TechnologyProvider";

function TechnologyPage() {
  return (
    <TechnologyProvider>
      <div>
        <div className="p-6">
          <h1 className="mb-4 text-left text-2xl font-semibold capitalize text-black">
            Technology Management
          </h1>
          <ActionBar />
          <TechCard />
        </div>
      </div>
    </TechnologyProvider>
  );
}

export default TechnologyPage;
