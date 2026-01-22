import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import BackButton from "../components/BackButton";
import "../Styles/Login.css"

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      // Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect after login
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-container">
      <BackButton to="/" />
      <div className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">
          Login to access study materials shared by teachers
        </p>

        <div className="login-divider">
          <span>Sign in with Google</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        <div className="login-navigation">
          <p className="login-navigation-text">
            Don't have an account?{" "}
            <Link to="/register" className="login-navigation-link">
              Create Account
            </Link>
          </p>
          <p className="login-navigation-text">
            <Link to="/" className="login-navigation-link">
              Go to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
