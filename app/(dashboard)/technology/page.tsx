import ActionBar from "@/app/(dashboard)/technology/_components/ActionBar";
import { TechCard } from "@/app/(dashboard)/technology/_components/TechCard";

function TechnologyPage() {
  return (
    <div>
      <div className="p-6">
        <h1 className="mb-4 text-left text-2xl font-semibold capitalize text-black">
          Technology Management
        </h1>
        <ActionBar />
        <TechCard />
      </div>
    </div>
  );
}

export default TechnologyPage;
