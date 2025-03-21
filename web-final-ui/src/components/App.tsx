import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import RegistrationForm from "./RegistrationForm";
import LogInForm from "./LoginForm";
import UserFeed from "./UserFeed";
import UserProfile from "./UserProfile";
import Sidebar from "./SideBar";
import AddPost from "./AddPost";
import PostDetailPage from "./PostDetail";

import "../styles/App.css";
import ProtectedRoute from "./auth-utils/ProtectedRoute";
import { AuthProvider } from "./auth-utils/AuthContext";

const RedirectToDefault: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    navigate(userId ? "/feed" : "/login");
  }, [navigate]);

  return null;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="34674964625-uifdk6h0kl4qiv0d88imk5f2di821hk2.apps.googleusercontent.com">
        <Router>
          <div className="app-container">
            <Routes>
              <Route path="/" element={<RedirectToDefault />} />
              <Route path="/login" element={<LogInForm />} />
              <Route path="/register" element={<RegistrationForm />} />

              <Route element={<ProtectedRoute />}>
                <Route
                  path="/feed"
                  element={
                    <div className="main-layout">
                      <Sidebar />
                      <div className="content">
                        <UserFeed />
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <div className="main-layout">
                      <Sidebar />
                      <div className="content">
                        <AddPost />
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <div className="main-layout">
                      <Sidebar />
                      <div className="content">
                        <UserProfile />
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/post/:postId"
                  element={
                    <div className="main-layout">
                      <Sidebar />
                      <div className="content">
                        <PostDetailPage />
                      </div>
                    </div>
                  }
                />
              </Route>
              <Route path="*" element={<RedirectToDefault />} />
            </Routes>
          </div>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
};

export default App;
