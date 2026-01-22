import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import BackButton from "../components/BackButton";
import "../Styles/EditProfile.css";

const EditProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const res = await api.get("/auth/profile");
      setName(res.data.user.name);
      setEmail(res.data.user.email);
    };
    loadProfile();
  }, []);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.put("/auth/updateProfile", { name, email, password });
      alert("Profile updated successfully");
      navigate("/profile");
    } catch {
      alert("Update failed");
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("This will permanently delete your account and all your notes. This action cannot be undone. Continue?")) return;

    try {
      await api.delete("/auth/deleteProfile");
      localStorage.clear();
      alert("Account deleted successfully");
      navigate("/login");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Delete failed");
    }
  };

  return (
    <div className="edit-profile-page">
      <BackButton to="/profile" />
      <form className="edit-profile-card" onSubmit={updateProfile}>
        <h2>Edit Profile</h2>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password (optional)"
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn-save" type="submit">
          Save Changes
        </button>

        <button
          type="button"
          className="btn-danger"
          onClick={deleteAccount}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
