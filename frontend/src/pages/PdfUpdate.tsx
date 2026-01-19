import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../Styles/PdfUpdate.css"

const PdfUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch PDF info
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await api.get(`/pdfs`);
        const pdfData = res.data.find((p: any) => p._id === id);
        if (pdfData) {
          setSubject(pdfData.subject);
          setTeacherName(pdfData.teacherName);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPdf();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("teacherName", teacherName);
      if (file) formData.append("pdf", file);

      await api.put(`/pdfs/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("PDF updated successfully");
      navigate("/pdfs");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Update failed");
    }
  };

  return (
    <div className="pdf-update-container">
      <form className="pdf-update-form" onSubmit={handleSubmit}>
        <h2>Update PDF</h2>

        <input
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          placeholder="Teacher Name"
          value={teacherName}
          onChange={(e) => setTeacherName(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button type="submit">Update PDF</button>
      </form>
    </div>
  );
};

export default PdfUpdate;
