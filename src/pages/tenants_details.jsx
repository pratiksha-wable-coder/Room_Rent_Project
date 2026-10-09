import React, { useEffect, useState } from "react";
import "./tenants_details.css";
import Navbar from "./navbar";
import axios from "axios"; 

const Tenants_Details = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null); 
  const [formData, setFormData] = useState({ name: "", email: "", password: "", contact: "" });
  const [errors, setErrors] = useState({});

  // Get Admin ID from localStorage
  const adminId = localStorage.getItem('userId'); 

  const fetchCustomers = () => {
    fetch("http://localhost:8080/api/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let errorMsg = "";
    if (name === "name" && !value.trim()) errorMsg = "Name is required";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = "Email is required";
      else if (!emailRegex.test(value)) errorMsg = "Invalid email format";
    }
    if (name === "password" && !editingTenant) {
      const capitalRegex = /[A-Z]/;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (!value) errorMsg = "Password is required";
      else if (value.length !== 6) errorMsg = "Password must be 6 characters";
      else if (!capitalRegex.test(value)) errorMsg = "At least one capital letter required";
      else if (!specialCharRegex.test(value)) errorMsg = "At least one special symbol required";
    }
    if (name === "contact") {
      if (!value) errorMsg = "Contact is required";
      else if (value.length !== 10) errorMsg = "Contact must be 10 digits";
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    if (!editingTenant) {
      if (formData.password.length !== 6) newErrors.password = "Check requirements";
    }
    if (formData.contact.length !== 10) newErrors.contact = "Must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ 1. Relational Delete
  const handleDelete = (tenantId) => {
    if (!adminId) {
        alert("Admin session expired. Please login again.");
        return;
    }

    if (window.confirm("Are you sure you want to remove this customer everywhere?")) {
      axios.delete(`http://localhost:8080/api/admins/${adminId}/remove-tenant/${tenantId}`)
        .then((res) => {
            alert("Customer removed successfully! ✅");
            fetchCustomers();
        })
        .catch(err => console.error("Delete Error:", err));
    }
  };

  const handleEdit = (tenant) => {
    const tId = tenant._id || tenant.id;
    setEditingTenant(tId);
    setFormData({ name: tenant.name, email: tenant.email, contact: tenant.contact, password: "" }); 
    setErrors({});
  };

  // ✅ 2. Relational Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:8080/api/admins/${adminId}/update-tenant/${editingTenant}`, formData);
      alert("Tenant details updated everywhere! ✅");
      setEditingTenant(null); 
      fetchCustomers(); 
    } catch (err) {
      alert("Update failed! ❌");
    }
  };

  // ✅ 3. Relational Add
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!adminId) {
        alert("Admin ID not found. Please login again.");
        return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/admins/${adminId}/add-tenant`, {
        ...formData,
        role: "CUSTOMER"
      });
      if (response.status === 200 || response.status === 201) {
          alert("Customer Added and Linked! ✅");
          setShowAddForm(false);
          setFormData({ name: "", email: "", password: "", contact: "" });
          fetchCustomers();
      }
    } catch (err) {
        alert("Error adding customer. Check if email exists.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header-wrapper">
          <h1 className="main-heading">Tenants Listings</h1>
          <button className="add-customer-btn" onClick={() => { setShowAddForm(true); setEditingTenant(null); setFormData({name:"", email:"", password:"", contact:""}); setErrors({}); }}>
            + Add Customer
          </button>
        </div>

        {(showAddForm || editingTenant) && (
          <div className="admin-modal">
            <form className="deposit-card" onSubmit={editingTenant ? handleUpdateSubmit : handleAddSubmit}>
              <h2 className="form-header">{editingTenant ? "Update Customer" : "Add New Customer"}</h2>
              
              <div className="input-group">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error-text" style={{color: 'red', fontSize: '11px'}}>{errors.name}</span>}
              </div>

              <div className="input-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                {errors.email && <span className="error-text" style={{color: 'red', fontSize: '11px'}}>{errors.email}</span>}
              </div>

              {!editingTenant && (
                <div className="input-group">
                  <label>Password:</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} maxLength="6" />
                  {errors.password && <span className="error-text" style={{color: 'red', fontSize: '11px'}}>{errors.password}</span>}
                </div>
              )}

              <div className="input-group">
                <label>Contact:</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} maxLength="10" />
                {errors.contact && <span className="error-text" style={{color: 'red', fontSize: '11px'}}>{errors.contact}</span>}
              </div>

              <button type="submit" className="save-btn">
                {editingTenant ? "Update Changes" : "Save"}
              </button>
              <button type="button" className="cancel-btn" onClick={() => {setShowAddForm(false); setEditingTenant(null);}}>Cancel</button>
            </form>
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th colSpan="2" style={{textAlign: 'center'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const cId = customer._id || customer.id;
                return (
                  <tr key={cId}>
                    <td>{cId ? cId.slice(0, 8) : "N/A"}</td>
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.contact}</td>
                    <td style={{textAlign: 'right'}}>
                      <button className="edit-btn" onClick={() => handleEdit(customer)}>Update</button>
                    </td>
                    <td style={{textAlign: 'left'}}>
                      <button className="remove-btn" onClick={() => handleDelete(cId)}>Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Tenants_Details;