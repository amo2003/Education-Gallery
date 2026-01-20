import { useEffect, useState } from "react";
import api from "../api/axios";
import PdfCard from "../components/PdfCard";
import type { Pdf } from "./PdfList";
import "../Styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
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

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <span
            className={`profile-role ${
              user?.role === "teacher" ? "role-teacher" : "role-student"
            }`}
          >
            {user?.role}
          </span>
        </div>

        {user && (
          <div className="profile-info">
            <div className="info-box">
              <span>Name</span>
              <p>{user.name}</p>
            </div>
            <div className="info-box">
              <span>Email</span>
              <p>{user.email}</p>
            </div>
          </div>
        )}

        <div className="notes-section">
          {user?.role === "teacher" && (
            <>
              <h3>My Shared Notes</h3>
              <p className="notes-hint">
                Upload, update or delete your study materials
              </p>

              {notes.length === 0 ? (
                <p className="empty-text">
                  You haven't uploaded any notes yet.
                </p>
              ) : (
                <div className="notes-grid">
                  {notes.map((pdf) => (
                    <PdfCard
                      key={pdf._id}
                      pdf={pdf}
                      refresh={fetchProfile}
                      userRole={user.role}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {user?.role === "student" && (
            <>
              <h3>Student Dashboard</h3>
              <p className="notes-hint">
                Browse study materials from the home page
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
