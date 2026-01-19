import { useEffect, useState } from "react";
import api from "../api/axios";
import PdfCard from "../components/PdfCard";
import type { Pdf } from "./PdfList";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
      // only set notes uploaded by the teacher
      if (res.data.notes) {
        setNotes(res.data.notes);
      }
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const refreshNotes = () => {
    fetchProfile();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <h2>My Profile</h2>

      {user && (
        <div style={{ marginBottom: "30px" }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}

      {user?.role === "teacher" && (
        <div>
          <h3>My Shared Notes</h3>
          <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.95rem" }}>
            Manage your uploaded notes: Update or Delete them as needed.
          </p>
          {notes.length === 0 ? (
            <p>You haven't uploaded any notes yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "15px", marginTop: "10px" }}>
              {notes.map((pdf) => (
                <PdfCard 
                  key={pdf._id} 
                  pdf={pdf} 
                  refresh={refreshNotes}
                  userRole={user.role}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {user?.role === "student" && (
        <div>
          <h3>Available Notes</h3>
          {notes.length === 0 ? (
            <p>No notes available at the moment. Check the main page.</p>
          ) : (
            <div style={{ display: "grid", gap: "15px", marginTop: "10px" }}>
              {notes.map((pdf) => (
                <PdfCard 
                  key={pdf._id} 
                  pdf={pdf} 
                  refresh={() => {}}
                  userRole={user?.role}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
