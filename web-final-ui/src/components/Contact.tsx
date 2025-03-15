import React, { useEffect, useState } from "react";
import "../styles/Contact.css";
import userService from "../services/user_service";

const Contact: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId") || "";
        if (!userId) return;

        const { request } = userService.getUserProfile(userId);
        const res = await request;
        setUsername(res.data.username);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-sidebar">
      <div className="user-info">
        <h3>Hello, {username} 👋</h3>
      </div>
      <div className="contact-section">
        <h4>📩 Contact Us</h4>
        <p>📞Support and Inquiries - 123456789</p>
        <p>📧 <a href="mailto:support@example.com">Send us an email</a></p>
      </div>
    </div>
  );
};

export default Contact;
