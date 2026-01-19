import { useEffect } from "react";
import api from "../api/axios";

const Dashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    api.get("/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  return <h1>Dashboard (Protected)</h1>;
};

export default Dashboard;
