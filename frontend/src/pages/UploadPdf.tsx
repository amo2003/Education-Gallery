import { useState } from "react";
import api from "../api/axios";
import BackButton from "../components/BackButton";
import "../Styles/UploadPdf.css";

const UploadPdf = () => {
  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdf) {
      alert("Please select a PDF");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("teacherName", teacherName);
      formData.append("pdf", pdf);

      await api.post("/pdfs/upload", formData);

      alert("PDF uploaded successfully");
      window.location.href = "/Profile"
      setSubject("");
      setTeacherName("");
      setPdf(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="upload-page">
      <BackButton to="/profile" />
      <form className="upload-card" onSubmit={submitHandler}>
        <h2>Upload Study Notes</h2>

        <div className="upload-group">
          <input
            type="text"
            placeholder="Subject Name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="upload-group">
          <input
            type="text"
            placeholder="Teacher Name"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            required
          />
        </div>

        <div className="upload-group">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button className="upload-btn" type="submit">
          Upload PDF
        </button>
      </form>
    </div>
  );
};

export default UploadPdf;
