import React, { useState, CSSProperties } from "react";

const HomePage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Welcome, ${data.email}!`);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Pursuit Progress Tracker</h1>
      <p style={styles.description}>
        Welcome to the Pursuit Progress Tracker! Track your projects,
        milestones, and submissions with ease.
      </p>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
  },
  description: {
    fontSize: "1.2rem",
    color: "#666",
    textAlign: "center",
    maxWidth: "600px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    marginTop: "20px",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    fontSize: "1rem",
    width: "250px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default HomePage; 