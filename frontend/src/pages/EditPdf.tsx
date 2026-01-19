import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

const EditPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);

  const updateHandler = async (e: any) => {
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
    <form onSubmit={updateHandler}>
      <h2>Edit PDF</h2>

      <input
        placeholder="New Subject"
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        placeholder="New Teacher Name"
        onChange={(e) => setTeacherName(e.target.value)}
      />

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdf(e.target.files![0])}
      />

      <button type="submit">Update</button>
    </form>
  );
};

export default EditPdf;
