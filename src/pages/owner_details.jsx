import React, { useEffect, useState } from "react";
import "./owner_details.css"; 
import Navbar from "./navbar";
import axios from "axios"; 

const Owner_Details = () => {
  const [owners, setOwners] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null); 
  const [formData, setFormData] = useState({ name: "", email: "", password: "", contact: "" });
  const [errors, setErrors] = useState({});

  // ✅ Admin Session ID
  const adminId = localStorage.getItem('userId'); 

  const fetchOwners = () => {
    fetch("http://localhost:8080/api/owners")
      .then((res) => res.json())
      .then((data) => setOwners(data))
      .catch((err) => console.error("Error fetching owners:", err));
  };

  useEffect(() => { fetchOwners(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.contact.length !== 10) newErrors.contact = "Contact must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (ownerId) => {
    if (window.confirm("Are you sure you want to remove this owner everywhere?")) {
      axios.delete(`http://localhost:8080/api/admins/${adminId}/remove-owner/${ownerId}`)
        .then((res) => {
            alert("Owner removed successfully! ✅");
            fetchOwners();
        })
        .catch(err => console.error("Delete Error:", err));
    }
  };

  const handleEdit = (owner) => {
    const oId = owner._id || owner.id;
    setEditingOwner(oId); 
    setFormData({ name: owner.name, email: owner.email, contact: owner.contact, password: "" }); 
    setErrors({});
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.put(`http://localhost:8080/api/admins/${adminId}/update-owner/${editingOwner}`, formData);
      alert("Owner updated everywhere! ✅");
      setEditingOwner(null);
      fetchOwners();
    } catch (err) { 
      alert("Update Failed! ❌"); 
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!adminId) {
        alert("Admin ID not found. Please login again.");
        return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/admins/${adminId}/add-owner`, {
          ...formData,
          role: "OWNER"
      });

      if (response.status === 200 || response.status === 201) {
          alert("Owner Added and Linked! ✅");
          setShowAddForm(false);
          setFormData({ name: "", email: "", password: "", contact: "" }); 
          fetchOwners();
      }
    } catch (error) {
        alert("Error adding owner. Check if email already exists.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="header-wrapper">
          <h1 className="main-heading">Property Owners</h1>
          <button className="add-customer-btn" onClick={() => { setShowAddForm(true); setEditingOwner(null); setFormData({name:"", email:"", password:"", contact:""}); setErrors({}); }}>
            + Add Owner
          </button>
        </div>

        {(showAddForm || editingOwner) && (
          <div className="admin-modal">
            <form className="deposit-card" onSubmit={editingOwner ? handleUpdateSubmit : handleAddSubmit}>
              <h2 className="form-header">{editingOwner ? "Update Owner" : "Add New Owner"}</h2>
              
              <div className="input-group">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
                {errors.name && <span className="error-text" style={{color: 'red', fontSize: '11px'}}>{errors.name}</span>}
              </div>

              <div className="input-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>

              {!editingOwner && (
                <div className="input-group">
                  <label>Password:</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} maxLength="6" />
                </div>
              )}

              <div className="input-group">
                <label>Contact:</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} maxLength="10" />
                {errors.contact && <span className="error-text" style={{color: 'red', fontSize: '11px'}}>{errors.contact}</span>}
              </div>

              <button type="submit" className="save-btn">{editingOwner ? "Update" : "Save"}</button>
              <button type="button" className="cancel-btn" onClick={() => {setShowAddForm(false); setEditingOwner(null);}}>Cancel</button>
            </form>
          </div>
        )}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Contact</th><th>Action</th></tr>
            </thead>
            <tbody>
              {owners.map((owner) => {
                const oId = owner._id || owner.id;
                return (
                  <tr key={oId}>
                    <td>{oId ? oId.slice(0, 8) : "N/A"}</td>
                    <td>{owner.name}</td>
                    <td>{owner.email}</td>
                    <td>{owner.contact}</td>
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(owner)}>Update</button>
                      <button className="remove-btn" onClick={() => handleDelete(oId)}>Remove</button>
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

export default Owner_Details;