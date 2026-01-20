import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import "../Styles/EditPdf.css";

const EditPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  // Fetch current PDF details to show in labels / default values
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await api.get(`/pdfs/${id}`);
        setSubject(res.data.subject || "");
        setTeacherName(res.data.teacherName || "");
      } catch (err: any) {
        alert(err?.response?.data?.message ?? "Failed to load note details");
      }
    };

    if (id) {
      fetchPdf();
    }
  }, [id]);

  const updateHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (subject) formData.append("subject", subject);
    if (teacherName) formData.append("teacherName", teacherName);
    if (pdf) formData.append("pdf", pdf);

    try {
      await api.put(`/pdfs/update/${id}`, formData);
      alert("Note updated successfully");
      navigate("/profile");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to update note");
    }
  };

  return (
    <div className="edit-page">
      <form className="edit-card" onSubmit={updateHandler}>
        <h2>Edit Study Note</h2>

        <div className="edit-group">
          <label>Subject</label>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="edit-group">
          <label>Teacher Name</label>
          <input
            type="text"
            placeholder="Teacher Name"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
          />
        </div>

        <div className="edit-group">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
          />
        </div>

        <button className="edit-btn" type="submit">
          Update Note
        </button>
      </form>
    </div>
  );
};

export default EditPdf;
