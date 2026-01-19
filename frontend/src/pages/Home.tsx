import { useEffect, useState } from "react";
import api from "../api/axios";
import "../Styles/Home.css";
import "../Styles/Modal.css";
import { useNavigate, Link } from "react-router-dom";
import { getToken, logout } from "../utils/auth";

// Login Modal Component
const LoginModal = ({ onClose, onSuccess, onSwitchToRegister }: { onClose: () => void; onSuccess: () => void; onSwitchToRegister: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      
      // Fetch and store user profile (including role)
      try {
        const profileRes = await api.get("/auth/profile");
        if (profileRes.data?.user) {
          localStorage.setItem("user", JSON.stringify(profileRes.data.user));
        }
      } catch (profileErr) {
        console.error("Failed to fetch user profile");
      }
      
      onSuccess();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <form className="modal-form" onSubmit={handleLogin}>
          <h2 className="modal-title">Sign In</h2>
          <input
            className="modal-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="modal-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="modal-button" type="submit">
            Sign In
          </button>
          <p className="modal-switch">
            Don't have an account?{" "}
            <button type="button" className="modal-link" onClick={onSwitchToRegister}>
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// Register Modal Component
const RegisterModal = ({ onClose, onSuccess, onSwitchToLogin }: { onClose: () => void; onSuccess: () => void; onSwitchToLogin: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { name, email, role, password });
      alert("Registered successfully");
      onSuccess();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Registration failed");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <form className="modal-form" onSubmit={handleSubmit}>
          <h2 className="modal-title">Create Account</h2>
          <input
            className="modal-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select 
            className="modal-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <input
            className="modal-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="modal-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="modal-button" type="submit">
            Register
          </button>
          <p className="modal-switch">
            Already have an account?{" "}
            <button type="button" className="modal-link" onClick={onSwitchToLogin}>
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

interface Stats {
  teachers: number;
  students: number;
  notes: number;
}

function Home() {
  const [stats, setStats] = useState<Stats>({ teachers: 0, students: 0, notes: 0 });
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!getToken();

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  // Fetch user profile if logged in
  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to load user profile");
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowDropdown(false);
    navigate("/");
    window.location.reload(); // Refresh to update navbar
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    window.location.reload(); // Refresh to update navbar
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true); // Switch to login modal after registration
  };

  useEffect(() => {
    fetchStats();
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar__dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showLoginModal || showRegisterModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showLoginModal, showRegisterModal]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="navbar__logo">ZeroToHero</Link>
        <ul className="navbar__links">
          <li><Link to="/userlist">Home</Link></li>
          <li><Link to="/list">Study Notes</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {!isLoggedIn && <li><button className="navbar__link-button" onClick={() => setShowLoginModal(true)}>Sign In</button></li>}
        </ul>
        <div className="navbar__buttons">
          {isLoggedIn ? (
            <div className="navbar__user-menu">
              <span className="navbar__user-name">{user?.name || "User"}</span>
              <div className="navbar__dropdown">
                <button 
                  className="navbar__dots" 
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  ⋯
                </button>
                {showDropdown && (
                  <div className="navbar__dropdown-menu">
                    <Link to="/profile" onClick={() => setShowDropdown(false)}>
                      Profile
                    </Link>
                    {user?.role === "teacher" && (
                      <Link to="/upload" onClick={() => setShowDropdown(false)}>
                        Upload Notes
                      </Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="navbar__button" onClick={() => setShowRegisterModal(true)}>
              Create Account +
            </button>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">Learn Smarter, Not Harder</h1>
          <p className="hero__subtitle">
            Access quality learning resources and connect with top teachers anytime.
          </p>
        </div>
      </section>

      {/* EDUCATION VALUES */}
      <section className="values" id="values">
        <h2 className="values__title">Our Educational Values</h2>
        <div className="values__grid">
          <div className="value-card">
            <h3>Quality Learning</h3>
            <p>We provide high-quality resources curated by expert teachers.</p>
          </div>
          <div className="value-card">
            <h3>Flexibility</h3>
            <p>Learn anytime, anywhere, and at your own pace.</p>
          </div>
          <div className="value-card">
            <h3>Community</h3>
            <p>Connect with teachers and fellow learners for better growth.</p>
          </div>
        </div>
      </section>

      {/* GREETING / WELCOME MESSAGE */}
      <section className="greeting" id="greeting">
        <div className="greeting__inner">
          <h2>Welcome to ZeroToHero</h2>
          <p>
            Empowering learners and educators alike to achieve more through interactive
            and accessible educational resources.
          </p>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats" id="stats">
        <div className="stats__grid">
          <div className="stat-card">
            <h3>{stats.teachers}</h3>
            <p>Registered Teachers</p>
          </div>
          <div className="stat-card">
            <h3>{stats.students}</h3>
            <p>Registered Students</p>
          </div>
          <div className="stat-card">
            <h3>{stats.notes}</h3>
            <p>Available Notes</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="footer">
        <p>© 2026 ZeroToHero. All rights reserved.</p>
      </footer>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <RegisterModal 
          onClose={() => setShowRegisterModal(false)} 
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
}

export default Home;
