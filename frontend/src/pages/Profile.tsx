import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PdfCard from "../components/PdfCard";
import BackButton from "../components/BackButton";
import type { Pdf } from "./PdfList";
import "../Styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Pdf[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
      setNotes(res.data.notes || []);
    } catch {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <BackButton to="/" />
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          <span className={`profile-role role-${user.role}`}>
            {user.role}
          </span>
        </div>

        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <button className="pbtn-edit" onClick={() => navigate("/edit-profile")}>
            ✏️ Edit Profile
        </button>

        </div>

        {user.role === "teacher" && (
          <>
            <h3 className="notes-title">My Shared Notes</h3>
            <div className="notes-grid">
              {notes.map(pdf => (
                <PdfCard
                  key={pdf._id}
                  pdf={pdf}
                  refresh={fetchProfile}
                  userRole={user.role}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
