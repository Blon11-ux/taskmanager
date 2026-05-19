"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful! Now go to login.");
        setEmail("");
        setPassword("");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "400px", margin: "0 auto", color: "white" }}>
      <h1 style={{ color: "white", marginBottom: "20px" }}>Create Account</h1>
      
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ 
            padding: '12px', 
            backgroundColor: '#ffffff', 
            color: '#000000', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontSize: '16px'
          }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ 
            padding: '12px', 
            backgroundColor: '#ffffff', 
            color: '#000000', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontSize: '16px'
          }} 
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '12px', 
            backgroundColor: '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      
      {error && <p style={{ color: '#ff4d4d', marginTop: '15px', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
}