import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    console.log("Email:", email);
    console.log("Password:", password);
    alert("Login clicked! (backend coming in Week 3)");
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f4f4"
    }}>

      <div style={{
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>

        {/* Logo / Title */}
        <h1 style={{ textAlign: "center", color: "#2e7d32", marginBottom: "8px" }}>
          🌿 MindNest
        </h1>
        <p style={{ textAlign: "center", color: "#777", marginBottom: "30px" }}>
          Your thoughts. Your space.
        </p>

        {/* Email Field */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px", color: "#444" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "6px", color: "#444" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

      </div>
    </div>
  );
}

export default Login;