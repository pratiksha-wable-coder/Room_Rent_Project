import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./registration.css";

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    role: ""
  });

  const [errors, setErrors] = useState({});

  // ================= VALIDATION FUNCTION =================
  const validate = () => {
    let newErrors = {};
    let capitalLetterRegex = /[A-Z]/;
  

    if (!formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    const contactRegex = /^[6-9]\d{9}$/;
    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
    } else if (!contactRegex.test(formData.contact)) {
      newErrors.contact = "Invalid 10 digit number";
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.toLocaleLowerCase())) {
      newErrors.email = "Invalid email address(Use Standard Format like abc@example.com)";
      const capitalLetterRegex = /[A-Z]/;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length !== 6) {
      newErrors.password = "Password must be exactly 6 characters";
    }else if (!capitalLetterRegex.test(formData.password)) {
      newErrors.password = "Password must contain at least one capital letter";
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    let errormsg = "";

    if (name === "email") {
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (!value) {
            errormsg = "Email is required";
        } else if (!value.includes("@") || !value.includes(".")) {
            errormsg = "Email must contain '@' and '.'";
        } else if (!emailRegex.test(value.toLowerCase())) {
            errormsg = "Invalid email address (ex: abc@example.com)";
        }
    }

    if (name === "password") {
        const capitalLetterRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!value) {
            errormsg = "Password is required";
        } else if (value.length !== 6) {
            errormsg = "Password must be exactly 6 characters";
        } else if (!capitalLetterRegex.test(value)) {
            errormsg = "Password must contain at least one capital letter";
        } else if (!specialCharRegex.test(value)) {
            errormsg = "Password must contain at least one special character(!@$#%^&*())";
        }
    }

    if (name === "contact") {
        const contactRegex = /^[6-9]\d{9}$/;
        if (!value) {
            errormsg = "Contact number is required";
        } else if (!contactRegex.test(value)) {
            errormsg = "Invalid 10 digit number";
        }
    }

    setErrors((prev) => ({ ...prev, [name]: errormsg }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let response;
      if (formData.role === "OWNER") {
        response = await api.post("/api/owners/registration", formData);
      } else if (formData.role === "ADMIN") {
        response = await api.post("/api/admins/registration", formData);
      } else {
        response = await api.post("/api/customers/registration", { ...formData, role: "CUSTOMER" });
      }

      alert("Registration Successful ✅");
      navigate("/login");
    } catch (error) {
      alert("Error: Email already exists or server error ❌");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        
        {/* --- LEFT SIDE: IMAGE (Half Screen) --- */}
        <div className="auth-left">
          <div className="overlay-content">
            <h1>Join Us Today</h1>
            <p>Your perfect room is just a few clicks away.</p>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="auth-right">
          <div className="form-box">
            <h3 className="form-header">Create Account</h3>
            
            <form className="form-content" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="abc xyz" />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} maxLength="10" placeholder="9999985689" />
                {errors.contact && <span className="error-text">{errors.contact}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="abc@example.com" />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="******" />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label>Select Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role</option>
                  <option value="CUSTOMER">Tenant</option>
                  <option value="OWNER">Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {errors.role && <span className="error-text">{errors.role}</span>}
              </div>

              <button type="submit" className="signup-btn">Sign Up</button>
            </form>

            <p className="footer-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Registration;