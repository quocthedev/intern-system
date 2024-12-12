"use client";
import { Input } from "@nextui-org/input";
import InterviewScheduleModal from "@/components/InterviewScheduleModal";
import { useInterviewContext } from "../_providers/InterviewProvider";
import InterviewFilter from "@/app/(dashboard)/interview/_component/InterviewFilter";
export default function ActionBar() {
  const { refetchListInterview, setInterviewPageIndex } =
    useInterviewContext() || {};

  const { setSearch } = useInterviewContext();

  return (
  <div className="mt-3">
    <div className="mb-5 mt-3 flex w-full items-center gap-2">
      <Input
        type="name"
        placeholder="Search by title, interviewer name"
        size="md"
        onChange={(e) => setSearch(e.target.value)}
      />
      <InterviewScheduleModal
        isAddingCandidate
        callback={() => {
          refetchListInterview && refetchListInterview();
          setInterviewPageIndex && setInterviewPageIndex(1);
        }}
      />
      </div>
      <InterviewFilter />
    </div>
  );
}
