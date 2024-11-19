import { API_ENDPOINTS } from "@/libs/config";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface PDFEmbedProps {
  pdfUrl: string;
}

const PDFEmbed: React.FC<PDFEmbedProps> = ({ pdfUrl }) => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={pdfUrl}
        style={{ width: "100%", height: "100%" }}
        title="Embedded PDF Document"
      />
    </div>
  );
};

export default function CandidateCVPage() {
  const params = useParams();
  const candidateId = params.detailId as string;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ["data", candidateId],
    queryFn: async () => {
      const response = await fetch(`${API_ENDPOINTS.candidate}/${candidateId}`);
      const candidate = await response.json();

      return candidate;
    },
  });

  const candidateData = data?.data || {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_ENDPOINTS.candidate}/${candidateId}/upload-cv`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
      toast.success("CV uploaded successfully!");
      await refetch();
    } catch (error) {
      setUploadError("Failed to upload CV.");
      toast.error("Error uploading CV");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    handleUpload();
  }, [selectedFile]);

  return (
    <div className="p-4">
      {uploadError && <div style={{ color: "red" }}>{uploadError}</div>}
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          <div className="mb-4 flex justify-end space-x-2">
            <Button
              onPress={() => document.getElementById("uploadCV")?.click()}
              color="primary"
              size="md"
            >
              {uploading ? "Uploading..." : "Upload CV"}
            </Button>

            <input
              id="uploadCV"
              type="file"
              accept=".pdf, .docx"
              onChange={handleFileChange}
              disabled={uploading}
              hidden
            />
          </div>
          <PDFEmbed pdfUrl={candidateData.cvUri} />
        </div>
      )}
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
