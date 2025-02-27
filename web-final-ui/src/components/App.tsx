import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

import RegistrationForm from './RegistrationForm';
import LogInForm from './LoginForm';
import UserFeed from './UserFeed';
import UserProfile from './UserProfile';
import Sidebar from "./SideBar";
import AddPost from './AddPost';

import "../styles/App.css";

const App: React.FC = () => {
  console.log("App Loaded!");
  return (
    <GoogleOAuthProvider clientId="34674964625-uifdk6h0kl4qiv0d88imk5f2di821hk2.apps.googleusercontent.com">
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<LogInForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route
              path="/*"
              element={
                <div className="main-layout">
                  <Sidebar />
                  <div className="content">
                    <Routes>
                      <Route path="/feed" element={<UserFeed />} />
                      <Route path="/create-post" element={<AddPost />} />
                      <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;