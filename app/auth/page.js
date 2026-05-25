"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLoginView ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    setError("");
    setEmail("");      // Clear stale input on view switch
    setPassword("");   // Clear stale input on view switch
  };

  return (
    <div className="task-container" style={{ marginTop: "40px" }}>
      <div className="task-item" style={{ padding: "30px", borderLeft: "5px solid #0070f3" }}>

        <h1 className="task-title" style={{ fontSize: "1.75rem", marginBottom: "10px" }}>
          {isLoginView ? "Sign In" : "Create Account"}
        </h1>

        <p style={{ color: "#aaaaaa", fontSize: "14px", marginBottom: "25px" }}>
          {isLoginView
            ? "Access your secure private dashboard"
            : "Sign up to start tracking your individual tasks"}
        </p>

        <form
          onSubmit={handleAuthSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#dddddd" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="task-input"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", color: "#dddddd" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="task-input"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="task-button"
            style={{ width: "100%", marginTop: "10px" }}
          >
            {loading ? "Processing..." : isLoginView ? "Log In" : "Register"}
          </button>
        </form>

        {error && (
          <p className="task-error" style={{ marginTop: "15px" }}>
            ⚠️ {error}
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: "20px", borderTop: "1px solid #333", paddingTop: "20px" }}>
          <button
            type="button"
            onClick={handleToggleView}
            style={{
              background: "none",
              border: "none",
              color: "#0070f3",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {isLoginView
              ? "Don't have an account? Register Here"
              : "Already have an account? Sign In"}
          </button>
        </div>

      </div>
    </div>
  );
}