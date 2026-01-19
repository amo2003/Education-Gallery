import { useEffect, useState } from "react";
import api from "../api/axios";
import "../Styles/UserList.css";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UsersList = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setTeachers(res.data.teachers);
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="users-container">
      <h2>Registered Users</h2>

      <div className="users-category">
        <h3>Teachers ({teachers.length})</h3>
        {teachers.length === 0 ? (
          <p>No teachers registered yet.</p>
        ) : (
          <ul>
            {teachers.map((user) => (
              <li key={user._id}>
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="users-category">
        <h3>Students ({students.length})</h3>
        {students.length === 0 ? (
          <p>No students registered yet.</p>
        ) : (
          <ul>
            {students.map((user) => (
              <li key={user._id}>
                <strong>{user.name}</strong> - {user.email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UsersList;
