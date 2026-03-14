import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });
      
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "var(--background)",
      padding: "20px"
    }}>

      <div style={{
        backgroundColor: "var(--surface)",
        padding: "40px",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        width: "100%",
        maxWidth: "420px",
        border: "1px solid var(--border)"
      }}>

        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ 
            color: "var(--primary)", 
            margin: "0 0 8px 0", 
            fontSize: "2.5rem", 
            fontWeight: "700", 
            letterSpacing: "-0.02em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>
            <span style={{ fontSize: "2.2rem" }}>🌿</span>
            MindNest
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.05rem" }}>
            Welcome back to your space.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ 
            color: "#ef4444", 
            backgroundColor: "#fef2f2", 
            padding: "12px", 
            borderRadius: "var(--radius-md)", 
            marginBottom: "20px", 
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "500",
            border: "1px solid #fecaca"
          }}>
            {error}
          </div>
        )}

        {/* Email Field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "500", fontSize: "0.95rem" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "32px" }}>
          <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "500", fontSize: "0.95rem" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "var(--border)" : "var(--primary)",
            color: loading ? "var(--text-muted)" : "white",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "var(--shadow-sm)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {loading ? (
             <svg style={{ animation: "logo-spin 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line></svg>
          ) : null}
          {loading ? "Logging in..." : "Log in"}
        </button>

      </div>
    </div>
  );
}

export default Login;