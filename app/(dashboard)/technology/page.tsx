import { TechCard } from "@/app/(dashboard)/technology/_components/TechCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TechnologyPage() {
  return (
    <div>
      <div className="p-6">
        <h1 className="mb-4 text-left text-2xl font-semibold capitalize text-black">
          Technology Management
        </h1>
        <TechCard />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </div>
  );
}

export default TechnologyPage;
