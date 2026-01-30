import { useState } from "react";
import { apiRequest } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const endpoint = isRegister
      ? "/api/auth/register"
      : "/api/auth/login";

    const res = await apiRequest(endpoint, "POST", {
      email,
      password,
    });

    // Register success
    if (isRegister && res.message) {
      alert("Account created. Please login.");
      setIsRegister(false);
      return;
    }

    // Login success
    if (!isRegister && res.access_token) {
      localStorage.setItem("token", res.access_token);
      navigate("/dashboard");
    } else if (!isRegister) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isRegister ? "Create Account" : "Login"}
        </button>

        <div
          className="auth-link"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "Already have an account? Login"
            : "New user? Register here"}
        </div>
      </div>
    </div>
  );
}

export default Login;
