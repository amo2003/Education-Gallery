import { useState } from "react";
import api from "../api/axios";

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

      const res = await api.post("/pdfs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      alert("PDF uploaded successfully");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Upload PDF</h2>

      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />

      <input
        placeholder="Teacher Name"
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
        required
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
        required
      />

      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadPdf;
