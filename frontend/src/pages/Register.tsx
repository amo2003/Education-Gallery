import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css"; // Import CSS

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, role, password });
      alert("Registered successfully");
      navigate("/login");
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>

        <input
          className="register-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
    
        <select 
          className="register-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

        <input
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="register-button" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
