import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function resetForm() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  }

  function toggleMode() {
    setIsSignUp((prev) => !prev);
    resetForm();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      setLoading(true);

      if (isSignUp) {
        // Register the user
        await axios.post("http://localhost:5000/api/auth/register", {
          email,
          password
        });

        // Auto-login after successful registration
        const loginRes = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password
        });

        localStorage.setItem("token", loginRes.data.token);
        setSuccess("Account created! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        // Login
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password
        });
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || (isSignUp ? "Registration failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  }

  const spinnerSvg = (
    <svg style={{ animation: "logo-spin 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"></line>
      <line x1="12" y1="18" x2="12" y2="22"></line>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
      <line x1="2" y1="12" x2="6" y2="12"></line>
      <line x1="18" y1="12" x2="22" y2="12"></line>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
      <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
    </svg>
  );

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "var(--background)",
      padding: "20px"
    }}>

      <div className="login-container" style={{ transition: "all 0.3s ease" }}>

        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
            {isSignUp ? "Create your account to get started." : "Welcome back to your space."}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div style={{
          display: "flex",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          marginBottom: "24px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--background-input)"
        }}>
          <button
            type="button"
            onClick={() => { if (isSignUp) toggleMode(); }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "600",
              transition: "all 0.25s ease",
              backgroundColor: !isSignUp ? "var(--primary)" : "transparent",
              color: !isSignUp ? "white" : "var(--text-muted)",
              borderRadius: !isSignUp ? "var(--radius-md)" : "0"
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { if (!isSignUp) toggleMode(); }}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.95rem",
              fontWeight: "600",
              transition: "all 0.25s ease",
              backgroundColor: isSignUp ? "var(--primary)" : "transparent",
              color: isSignUp ? "white" : "var(--text-muted)",
              borderRadius: isSignUp ? "var(--radius-md)" : "0"
            }}
          >
            Sign Up
          </button>
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
            border: "1px solid #fecaca",
            animation: "fadeSlideIn 0.25s ease"
          }}>
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            color: "#16a34a",
            backgroundColor: "#f0fdf4",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            marginBottom: "20px",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "500",
            border: "1px solid #bbf7d0",
            animation: "fadeSlideIn 0.25s ease"
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "500", fontSize: "0.95rem" }}>
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
          <div style={{ marginBottom: isSignUp ? "20px" : "32px" }}>
            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "500", fontSize: "0.95rem" }}>
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
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

          {/* Confirm Password Field (Sign Up only) */}
          {isSignUp && (
            <div style={{
              marginBottom: "32px",
              animation: "fadeSlideIn 0.3s ease"
            }}>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-main)", fontWeight: "500", fontSize: "0.95rem" }}>
                Confirm Password
              </label>
              <input
                id="login-confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
          )}

          {/* Submit Button */}
          <button
            type="submit"
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
              gap: "8px",
              transition: "all 0.25s ease"
            }}
          >
            {loading ? spinnerSvg : null}
            {loading
              ? (isSignUp ? "Creating account..." : "Logging in...")
              : (isSignUp ? "Create Account" : "Log In")
            }
          </button>
        </form>

        {/* Bottom toggle link */}
        <p style={{
          textAlign: "center",
          marginTop: "24px",
          marginBottom: 0,
          color: "var(--text-muted)",
          fontSize: "0.93rem"
        }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={toggleMode}
            style={{
              color: "var(--primary)",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationColor: "transparent",
              transition: "text-decoration-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.textDecorationColor = "var(--primary)"}
            onMouseLeave={(e) => e.target.style.textDecorationColor = "transparent"}
          >
            {isSignUp ? "Log In" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;