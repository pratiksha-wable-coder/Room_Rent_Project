import React, { useState } from "react";
import axios from "axios";
import "./add_room1.css";
import Navbar from "./navbar";

const Add_Room1 = () => {
  const [formData, setFormData] = useState({
    rent: "",
    deposit: "",
    location: "",
    noOfRooms: "",
    description: "",
    roomType: "",
    waterSupply: "",
    furnishing: "",
    image: "",
    ownerName: "",
    ownerContact: ""
  });

  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminId = localStorage.getItem("userId");
      
      const payload = { 
        ...formData, 
        owner: { 
          id: adminId, 
          name: formData.ownerName, 
          contact: formData.ownerContact 
        } 
      };

      await axios.post("http://localhost:8080/api/rooms/add", payload);
      alert("Room Added Successfully! ✅");
      
      setFormData({
        rent: "", deposit: "", location: "", noOfRooms: "",
        description: "", roomType: "", waterSupply: "", furnishing: "",
        image: "", ownerName: "", ownerContact: ""
      });
      setPreview(null);
      setFileName("No file chosen");
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Failed to Add Room.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="overlay">
          <div className="form-card scrollable-card">
            <h2 className="form-title">Admin: Add Property</h2>

            <form className="room-form" onSubmit={handleSubmit}>

           
              <div className="input-group">
                <label style={{color: "#ffffff"}}>Owner Name</label>
                <input 
                  type="text" 
                  name="ownerName" 
                  placeholder="Enter Owner Name" 
                  value={formData.ownerName} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Owner Contact</label>
                <input 
                  type="text" 
                  name="ownerContact" 
                  placeholder="Enter Contact Number" 
                  value={formData.ownerContact} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Rent</label>
                <input type="text" name="rent" value={formData.rent} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Deposit</label>
                <input type="text" name="deposit" value={formData.deposit} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>No Of Rooms</label>
                <input type="text" name="noOfRooms" value={formData.noOfRooms} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Room Type</label>
                <select name="roomType" value={formData.roomType} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1RK">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Water Supply</label>
                <select name="waterSupply" value={formData.waterSupply} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="24 Hours">24 Hours</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Furnishing</label>
                <select name="furnishing" value={formData.furnishing} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi Furnished">Semi Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </div>

              <div className="input-group">
                <label style={{color: "#ffffff"}}>Upload Image</label>
                <input type="file" onChange={handleImageChange} />
                <p style={{color: "white"}}>{fileName}</p>
                {preview && <img src={preview} alt="Preview" width="150" />}
              </div>

              <button type="submit" className="submit-btn">Add Room</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add_Room1;