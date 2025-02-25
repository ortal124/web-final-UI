import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css"; // קובץ העיצוב

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // כאן ניתן להוסיף מחיקת טוקן / ניתוק המשתמש מהמערכת
    console.log("User logged out");
    navigate("/login"); // ניווט לעמוד כניסה
  };

  return (
    <div className="sidebar">
      <h2 className="logo">PixiePost</h2>

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
