import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth-utils/AuthContext";
import "../styles/Sidebar.css"; 
import icon from "../icons/fairy-icon.webp";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src={icon}
          alt="icon"
          className="app-icon"
        />
        <h2 className="logo">PixiePost</h2>
      </div>

      <nav className="nav-links">
        <Link to="/feed" className="nav-item">
          <i className="fas fa-home"></i> Feed
        </Link>
        <Link to="/create-post" className="nav-item">
          <i className="fas fa-plus-circle"></i> Create Post
        </Link>
        <Link to="/profile" className="nav-item">
          <i className="fas fa-user"></i> Profile
        </Link>
        <button onClick={handleLogout} className="nav-item logout">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
