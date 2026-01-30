import { useState } from "react";

function Register() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const updateField = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        name="email"
        placeholder="Email"
        onChange={updateField}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={updateField}
      />

      <button>Create Account</button>
    </div>
  );
}

export default Register;
