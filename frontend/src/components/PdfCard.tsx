import api from "../api/axios";
import { getUserRole } from "../utils/auth";
import { Link } from "react-router-dom";
import type { Pdf } from "../pages/PdfList";
import "../Styles/PdfCard.css"; // Import CSS

const PdfCard = ({ pdf, refresh, userRole }: { pdf: Pdf; refresh: () => void; userRole?: string }) => {
  const role = userRole || getUserRole();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${pdf.subject}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await api.delete(`/pdfs/delete/${pdf._id}`);
      alert("Note deleted successfully");
      refresh();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to delete note");
    }
  };

  const handleDownload = async () => {
    const res = await api.get(`/pdfs/download/${pdf._id}`, {
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(res.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = pdf.fileName || "file.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="pdf-card">
      <div className="pdf-card__icon">
        <img
          src="https://cdn-icons-png.flaticon.com/512/337/337946.png" 
          alt="PDF Icon"
        />
      </div>
      <div className="pdf-card__content">
        <h3>{pdf.subject}</h3>
        <p>Teacher: {pdf.teacherName}</p>
      </div>
      <div className="pdf-card__actions">
        <button className="btn-download" onClick={handleDownload}>
          Download
        </button>

        {role === "teacher" && (
          <>
            <Link to={`/edit-pdf/${pdf._id}`}>
              <button className="btn-edit" type="button">Update</button>
            </Link>
            <button className="btn-delete" onClick={handleDelete} type="button">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfCard;
