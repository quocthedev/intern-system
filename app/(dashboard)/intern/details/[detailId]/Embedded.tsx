import React from "react";

interface PDFEmbedProps {
  pdfUrl: string;
}

const PDFEmbed: React.FC<PDFEmbedProps> = ({ pdfUrl }) => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={pdfUrl}
        style={{ width: "100%", height: "100%" }}
        frameBorder="0"
        title="Embedded PDF Document"
      />
    </div>
  );
};

// This will fetch the PDF URL server-side
export async function getServerSideProps() {
  const pdfUrl =
    "https://firebasestorage.googleapis.com/v0/b/intern-system-1da55.appspot.com/o/L%C3%AA%20K%E1%BB%B3%20Qu%E1%BB%91c%28c.le%40gmail.com%29%2FCV%2Fcv-example.pdf?alt=media";

  return { props: { pdfUrl } };
}

// This is the page component that renders the PDFEmbed component
const PDFPage = ({ pdfUrl }: { pdfUrl: string }) => {
  return <PDFEmbed pdfUrl={pdfUrl} />;
};

export default PDFPage;
