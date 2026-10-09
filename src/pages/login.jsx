import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupAs, setSignupAs] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  /// ================= VALIDATION FUNCTION =================
  const validate = () => {
    let newErrors = {};
    const capitalLetterRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.toLowerCase())) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length !== 6) {
      newErrors.password = "Password must be exactly 6 characters";
    } else if (!capitalLetterRegex.test(password)) {
      newErrors.password = "At least one capital letter required";
    } else if (!specialCharRegex.test(password)) {
      newErrors.password = "At least one special symbol required";
    }

    if (!signupAs) {
      newErrors.signupAs = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleLogin = async () => {

    if (!validate()) return;

    try {

      let url = "";

      if (signupAs === "OWNER") {
        url = "http://localhost:8080/api/owners/login";
      } 
      else if (signupAs === "ADMIN") {
        url = "http://localhost:8080/api/admins/login";
      } 
      else {
        url = "http://localhost:8080/api/customers/login";
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login Failed");
      }

      const user = await res.json();

      localStorage.setItem("userId", user.id);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userContact", user.contact);

      if (user.role === "ADMIN") {
        navigate("/adminhome");
      } 
      else if (user.role === "OWNER") {
        navigate("/ownerhome");
      } 
      else if (user.role === "CUSTOMER") {
        navigate("/tenanthome");
      } 
      else {
        navigate("/");
      }

    } catch (err) {
      setErrors({ api: err.message });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-header">WELCOME</h2>

        {errors.api && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {errors.api}
          </p>
        )}
<div className="input-group" style={{ marginTop: "30px", marginBottom: "0px" }}>
  <label>Email:</label>
  <input
    className="login-input"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />

  <span className="error">
    {errors.email || ""}
  </span>
</div>

<div className="input-group" style={{ marginBottom: "30px", marginTop: "0px"  }}>
  <label>Password:</label>
  <input
    className="login-input"
    type="password"
    value={password}
    onChange={(e) => {
      const val = e.target.value;
      setPassword(val);
      
      let errorMsg = "";
      const capitalLetterRegex = /[A-Z]/;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

      if (!val) errorMsg = "Password is required";
      else if (val.length !== 6) errorMsg = "Password must be exactly 6 characters";
      else if (!capitalLetterRegex.test(val)) errorMsg = "At least one capital letter required";
      else if (!specialCharRegex.test(val)) errorMsg = "At least one special symbol required";

      setErrors({ ...errors, password: errorMsg });
    }}
  />
  {errors.password && <span className="error">{errors.password}</span>}
</div>

        <div className="input-group">
          <label>Sign in as:</label>
          <select
            className="login-input"
            value={signupAs}
            onChange={(e) => {
              setSignupAs(e.target.value);
              setErrors({ ...errors, signupAs: "" });
            }}
          >
            <option value="">Select role</option>
            <option value="OWNER">Owner</option>
            <option value="CUSTOMER">Tenant</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.signupAs && <span className="error">{errors.signupAs}</span>}
        </div>

        <button className="login-button" onClick={handleLogin}>
          Log in
        </button>

        <p className="login-footer">
          <Link to="/registration">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;