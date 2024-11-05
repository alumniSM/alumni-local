import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "../DashboardComponent/Header/Header";
import Sidebar from "../DashboardComponent/Sidebar/Sidebar";
import Dashboard from "../DashboardComponent/Side-component/Dashboard";
import Main from "../ui/Main";
import CreateEvent from "../DashboardComponent/Side-component/CreateEvent";
import CreateJob from "../DashboardComponent/Side-component/CreateJob";
import ManageEvent from "../DashboardComponent/Side-component/ManageEvent";
import CreateSurvey from "../DashboardComponent/Side-component/CreateSurvey";

import ManageSurvey from "../DashboardComponent/Side-component/ManageSurvey";
import ManageJob from "../DashboardComponent/Side-component/ManageJob";
import ProfileManagement from "../DashboardComponent/Side-component/ProfileMangemernt";
import AdminRoute from "../Pages/AdminRoute";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import ManageUser from "../DashboardComponent/Side-component/ManageUser";

function DashboardApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Store dashboard sub-route
  useEffect(() => {
    if (location.pathname.includes("/dashboard")) {
      localStorage.setItem("dashboardPath", location.pathname);
    }
  }, [location.pathname]);

  // Restore dashboard path on refresh
  useEffect(() => {
    const savedPath = localStorage.getItem("dashboardPath");
    if (savedPath && location.pathname === "/dashboard") {
      navigate(savedPath, { replace: true });
    }
  }, []);

  return (
    <div className="font-quickSand">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <Main>
        <Routes>
          <Route path="" element={<Dashboard />} />

          {/* Admin-only routes */}
          <Route
            path="/createjob"
            element={
              <AdminRoute>
                <CreateJob />
              </AdminRoute>
            }
          />
          <Route
            path="/createevent"
            element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/managejob"
            element={
              <AdminRoute>
                <ManageJob />
              </AdminRoute>
            }
          />
          <Route
            path="/manageevent"
            element={
              <AdminRoute>
                <ManageEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/managesurvey"
            element={
              <AdminRoute>
                <ManageSurvey />
              </AdminRoute>
            }
          />
          <Route
            path="/manageuser"
            element={
              <AdminRoute>
                <ManageUser />
              </AdminRoute>
            }
          />
          <Route
            path="/createsurvey"
            element={
              <AdminRoute>
                <CreateSurvey />
              </AdminRoute>
            }
          />
        </Routes>
      </Main>
    </div>
  );
}

export default DashboardApp;
