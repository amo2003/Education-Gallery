import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PdfCard from "../components/PdfCard";
import { getToken } from "../utils/auth";
import "../Styles/PdfList.css"; // Import scoped CSS

export interface Pdf {
  _id: string;
  subject: string;
  teacherName: string;
  fileName: string;
}

const PdfList = () => {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  // Fetch PDFs only if logged in
  const fetchPdfs = async () => {
    if (!isLoggedIn) return; // guests cannot fetch
    try {
      setLoading(true);
      const res = await api.get("/pdfs");
      setPdfs(res.data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, [isLoggedIn]);

  // Guest view
  if (!isLoggedIn) {
    return (
      <div className="pdf-list-container">
        <h2>Study Notes</h2>
        <p className="pdf-guest-message">
          You must login to view the notes.{" "}
          <button className="pdf-guest-button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    );
  }

  // Logged-in user view
  return (
    <div className="pdf-list-container">
      <h2>Study Notes</h2>

      {loading ? (
        <p>Loading notes...</p>
      ) : pdfs.length === 0 ? (
        <p>No notes uploaded yet.</p>
      ) : (
        <div className="pdf-grid">
          {pdfs.map((pdf) => (
            <PdfCard key={pdf._id} pdf={pdf} refresh={fetchPdfs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PdfList;
