import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/gestatie" className="nav-item">
        🐄 Gestație
      </NavLink>
      <NavLink to="/culturi" className="nav-item">
        🌾 Culturi
      </NavLink>
      <NavLink to="/camere" className="nav-item">
        📷 Camere
      </NavLink>
    </nav>
  );
};

export default Navbar;
