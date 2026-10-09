import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Registration from "./pages/registration";
import Login from "./pages/login";
import TenantHome from "./pages/tenanthome";
import AddRoom from "./pages/add_room";
import RoomDetails from "./pages/room_details";
import Owner_Details from "./pages/owner_details";
import Tenants_Details from "./pages/tenants_details";
import MyRoom from "./pages/myroom";
import Deposite_Details from "./pages/deposite_details";
import AdminHome from "./pages/adminhome";
import OwnerHome from "./pages/ownerhome";
import SpecificRoom from "./pages/specificroom";
import My_Properties from "./pages/my_properties";
import All_Booking from "./pages/all_booking";
import Deposite_Details1 from "./pages/deposite_details1"; 
import Add_Room1 from "./pages/add_room1"; 

function App() {
  return (
    <Router>
      <Routes>

        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />

        {/* Home Routes */}
        <Route path="/tenanthome" element={<TenantHome />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/ownerhome" element={<OwnerHome />} />

        {/* Room Routes */}
        <Route path="/room_details" element={<RoomDetails />} />
        <Route path="/add_room" element={<AddRoom />} />
        <Route path="/room/:id" element={<SpecificRoom />} />

        {/* Other Pages */}
        <Route path="/deposite_details" element={<Deposite_Details />} />
        <Route path="/owner_details" element={<Owner_Details />} />
        <Route path="/tenants_details" element={<Tenants_Details />} />
        <Route path="/myroom" element={<MyRoom />} />
        <Route path="/my_properties" element={<My_Properties />} />
        <Route path="/all_booking" element={<All_Booking />} />
        <Route path="/specificroom" element={<SpecificRoom />} />


        <Route path="/deposite_details1" element={<Deposite_Details1 />} /> 
        <Route path="/add_room1" element={<Add_Room1 />} />
      </Routes>
    </Router>
  );
}

export default App;