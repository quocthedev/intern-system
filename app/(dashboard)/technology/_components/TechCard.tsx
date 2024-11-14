"use client";
import { API_ENDPOINTS } from "@/libs/config";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Spinner } from "@nextui-org/spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  EditIcon,
  DeleteIcon,
} from "@/app/(dashboard)/technology/_components/Icons";
import { Divider } from "@nextui-org/divider";
import Image from "next/image";
import { PaginationResponse, PaginationResponseSuccess } from "@/libs/types";
import APIClient from "@/libs/api-client";
import { Pagination } from "@nextui-org/pagination";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";

export interface TechnologyInterface {
  name: String;
  abbreviation: string;
  imageUri: string;
  description: String;
  id: String;
  dateCreate: String;
  dateUpdate: String;
  isDeleted: Boolean;
}

const apiClient = new APIClient({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    console.log(error.response.data);
  },
});

export const TechCard = () => {
  const [selectedTech, setSelectedTech] = useState("");
  const {
    isOpen: isDeleteOpen,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
    onOpenChange: onOpenDeleteChange,
  } = useDisclosure();

  const [pageIndex, setPageIndex] = useState(1);

  const pageSize = 6;

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["technology", pageIndex, pageSize],
    queryFn: async () => {
      const response = await apiClient.get<
        PaginationResponse<TechnologyInterface>
      >(API_ENDPOINTS.technology, {
        params: new URLSearchParams({
          PageIndex: pageIndex.toString(),
          PageSize: pageSize.toString(),
        }),
      });

      if (response?.statusCode === "200") {
        const { data } =
          response as PaginationResponseSuccess<TechnologyInterface>;

        return {
          technologies: data.pagingData,
          pageIndex: data.pageIndex,
          totalPages: data.totalPages,
        };
      }
    },
  });

  console.log(data);

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(API_ENDPOINTS.technology + "/" + id, {
        method: "DELETE",
      }).then((response) => response.json()),

    onError: (error) => {
      toast.error(error.message);
    },

    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    toast.success("Deleted successfully!");
    onCloseDelete();
  };

  const openModalDelete = (id: string) => {
    onOpenDelete();
    setSelectedTech(String(id));
  };

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <div className="mt-20 flex items-center justify-center gap-3">
          <Spinner size="lg" />
          Loading...
        </div>
      ) : (
        <div>
          <div className="grid h-full grid-cols-3 gap-5">
            {data?.technologies &&
              data.technologies.map((technology: TechnologyInterface) => (
                <Card key={technology.id as string} className="w-full">
                  <CardHeader>
                    <div className="flex w-full justify-between">
                      <div className="text-md font-bold">{technology.name}</div>

                      <div className="flex space-x-1">
                        <EditIcon />
                        <button
                          className="bg-transparent"
                          onClick={() =>
                            openModalDelete(technology.id as string)
                          }
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <Image
                      className="my-3 ml-10"
                      width={200}
                      height={200}
                      alt={`${technology.name} Image`}
                      src={technology.imageUri}
                    />
                  </CardBody>
                </Card>
              ))}
          </div>

          <Pagination
            className="m-4 flex justify-center"
            isCompact
            loop
            showControls
            total={data?.totalPages ? Number(data.totalPages) : 0}
            initialPage={pageIndex}
            onChange={(page) => {
              setPageIndex(page);
            }}
          />

          <Modal
            isOpen={isDeleteOpen}
            onOpenChange={onOpenDeleteChange}
            className="max-w-fit"
          >
            <ModalContent>
              <ModalBody className="mt-5">
                Are you sure you want to delete?
                <div className="mt-5 grid grid-cols-2 gap-5">
                  <Button
                    onClick={() => handleDelete(selectedTech)}
                    color="primary"
                  >
                    Yes
                  </Button>
                  <Button onClick={onCloseDelete}>No</Button>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  );
};
