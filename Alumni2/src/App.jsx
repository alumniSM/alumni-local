import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./Pages/Navbar";
import Alumni from "./Pages/Alumni";
import Job from "./Pages/Job";

import Survey from "./Pages/Survey";
import Home from "./Pages/Home";
import Event from "./Pages/Event";

import Footer from "./Components/Footer";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import DashboardApp from "./Pages/DasboardApp";

import { AuthProvider } from "./AuthContext";
import { useAuth } from "./AuthContext";
import ProfileManagement from "./DashboardComponent/Side-component/ProfileMangemernt";
import { ProtectedRoute, PublicOnlyRoute } from "./Pages/ProtectedRoute";
import AdminRoute from "./Pages/AdminRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = location.pathname.includes("/dashboard");

  // Store current path when it changes
  useEffect(() => {
    localStorage.setItem("lastPath", location.pathname);
  }, [location.pathname]);

  // Check for stored path on initial load
  useEffect(() => {
    const lastPath = localStorage.getItem("lastPath");
    if (lastPath && window.location.pathname === "/") {
      navigate(lastPath, { replace: true });
    }
  }, []);

  return (
    <>
      {!isDashboardRoute ? (
        <div className="mx-4 sm:mx-[10%]">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event" element={<Event />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/job" element={<Job />} />
            <Route path="/survey" element={<Survey />} />
            {/* Protected Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileManagement />
                </ProtectedRoute>
              }
            />
            {/* Public only routes */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/createaccount"
              element={
                <PublicOnlyRoute>
                  <CreateAccount />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/dashboard/*"
              element={
                <AdminRoute>
                  <DashboardApp />
                </AdminRoute>
              }
            />
          </Routes>
          <Footer />
        </div>
      ) : (
        <Routes>
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default App;
