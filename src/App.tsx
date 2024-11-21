import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/pages/Auth/ProtectedRoute";
import Dashboard from "./components/pages/Dashboard/DashboardPage";
import LoginPage from "./components/pages/Auth/LoginPage";
import NavMenu from "./components/shared/NavMenu";
import FeedPage from "./components/pages/Feed/FeedPage";
import ProfilePage from "./components/pages/Profile/ProfilePage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Router>
        <AuthProvider>
          <NavMenu />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <FeedPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
