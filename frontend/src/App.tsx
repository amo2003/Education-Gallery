import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home"
import PdfList from "./pages/PdfList";
import UploadPdf from "./pages/UploadPdf";
import EditPdf from "./pages/EditPdf";
import Profile from "./pages/Profile";
import UsersList from "./pages/UserList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/list" element={<PdfList />} />
        <Route path="/upload" element={<UploadPdf />} />
        <Route path="/edit-pdf/:id" element={<EditPdf />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/userlist" element={<UsersList />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
