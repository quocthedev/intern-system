"use client";
import { API_ENDPOINTS } from "@/libs/config";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useInternPeriodContext } from "../_providers/InternPeriodDetailProvider";
import { toast } from "sonner";
import { formatDate, getCookie } from "@/app/util";
import { Skeleton } from "@nextui-org/skeleton";
import { useToggle } from "usehooks-ts";
import { EditIcon } from "../../../_components/Icons";
import { InternPeriod } from "@/data-store/intern-period/detail";

export default function InternPeriodInformation() {
  const {
    periodId,
    refetchInternPeriod,
    internPeriodData,
    isInternPeriodLoading,
  } = useInternPeriodContext();

  const [edit, toggleEdit] = useToggle(false);

  const updateMutation = useMutation({
    mutationFn: async (params: Partial<InternPeriod>) => {
      const response = await fetch(
        API_ENDPOINTS.internPeriod + "/" + periodId,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to create intern period");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      refetchInternPeriod();
      toggleEdit();
    },
    onError: (error) => {
      console.error("Error:", error); // Log the error to the console
      toast.error(error.message);
    },
  });

  const handleUpdate = async (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());

    const params = Object.assign({}, internPeriodData, data, {
      startDate: internPeriodData?.startDate.split("T")[0],
      endDate: internPeriodData?.endDate.split("T")[0],
    });

    console.log(params);

    updateMutation.mutate(params);
  };

  const role = getCookie("userRole");

  return (
    <>
      {isInternPeriodLoading ? (
        <div className="rounded-lg bg-white p-4 shadow-md">
          <Skeleton className="rounded-lg">
            <div className="mb-5 text-2xl font-semibold text-amber-600">
              Intern Period Details
            </div>
          </Skeleton>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>

            <Skeleton className="mt-2 rounded-lg">
              <div className="flex items-center border-b pb-2">
                <span className="w-1/2 font-medium">Loading :</span>
              </div>
            </Skeleton>
          </div>
        </div>
      ) : (
        <form
          className="rounded-lg bg-white p-4 shadow-md"
          action={handleUpdate}
        >
          <div className="mb-5 flex w-full items-center justify-between">
            <h2 className="text-2xl font-semibold text-amber-600">
              Intern Period Details
            </h2>
            {internPeriodData?.status == "InProgress" ||
            role === "Mentor" ||
            role === "University Offical" ? (
              <></>
            ) : (
              <div>
                {!edit ? (
                  <Button
                    variant="shadow"
                    size="md"
                    onPress={() => {
                      toggleEdit();
                    }}
                    startContent={<EditIcon />}
                    type="button"
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="md"
                      variant="shadow"
                      color="primary"
                      type="submit"
                    >
                      Save
                    </Button>
                    <Button
                      variant="shadow"
                      size="md"
                      onPress={() => {
                        toggleEdit();
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Name:</span>
              <Input
                defaultValue={internPeriodData?.name}
                variant="bordered"
                disabled={!edit}
                classNames={
                  !edit
                    ? {
                        inputWrapper: [
                          "group-data-[focus=true]:border-none",
                          "border-none",
                          "bg-transparent",
                          "ring-0",
                          "shadow-none",
                          "p-0",
                        ],
                      }
                    : {}
                }
                name="name"
                className="flex-1"
                isRequired
              />
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Duration :</span>
              <p>{internPeriodData?.internshipDuration} months</p>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Start Date:</span>
              <p> {formatDate(internPeriodData?.startDate as string)}</p>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">End Date:</span>
              <p>{formatDate(internPeriodData?.endDate as string)}</p>
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Max Candidates:</span>
              <Input
                defaultValue={String(internPeriodData?.maxCandidateQuantity)}
                type="number"
                variant="bordered"
                classNames={
                  !edit
                    ? {
                        inputWrapper: [
                          "group-data-[focus=true]:border-none",
                          "border-none",
                          "bg-transparent",
                          "ring-0",
                          "shadow-none",
                          "p-0",
                        ],
                      }
                    : {}
                }
                className="flex-1"
                disabled={!edit}
                name="maxCandidateQuantity"
                isRequired
              />
            </div>

            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Current Universitites:</span>
              <p>{internPeriodData?.currentUniversityQuantity}</p>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Current candidates:</span>
              <p>{internPeriodData?.currentCandidateQuantity}</p>
            </div>

            <div className="flex items-center">
              <span className="w-1/3 font-medium">Status:</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${internPeriodData?.status === "InProgress" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}
              >
                {internPeriodData?.status}
              </span>
            </div>
            <div className="flex items-center border-b pb-2">
              <span className="w-1/3 font-medium">Description:</span>
              <Input
                defaultValue={internPeriodData?.description}
                variant="bordered"
                classNames={
                  !edit
                    ? {
                        inputWrapper: [
                          "group-data-[focus=true]:border-none",
                          "border-none",
                          "bg-transparent",
                          "ring-0",
                          "shadow-none",
                          "p-0",
                        ],
                      }
                    : {}
                }
                name="description"
                className="flex-1"
                disabled={!edit}
                isRequired
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
}
