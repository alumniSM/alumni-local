import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import api from "../../api";
import { IoCloseOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      if (token) {
        try {
          const response = await api.get("/users/profile");
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    fetchUserData();

    // Add profile update listener
    const handleProfileUpdate = (event) => {
      setUserData(event.detail);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [isLoggedIn, logout]);

  const handleLogout = () => {
    logout();
    setUserData(null);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-24 md:w-32 cursor-pointer"
        src={assets.dbulogo}
        alt="Logo"
      />

      {/* Navigation Links - Desktop */}
      <ul className="hidden font-semibold md:flex items-start gap-5 font-me">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `py-1 uppercase ${
              isActive
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-700 hover:text-teal-500"
            }`
          }
        >
          <li>Home</li>
        </NavLink>
        <NavLink
          to="/event"
          className={({ isActive }) =>
            `py-1 uppercase ${
              isActive
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-700 hover:text-teal-500"
            }`
          }
        >
          <li>Event</li>
        </NavLink>
        <NavLink
          to="/alumni"
          className={({ isActive }) =>
            `py-1 uppercase ${
              isActive
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-700 hover:text-teal-500"
            }`
          }
        >
          <li>Alumni</li>
        </NavLink>
        <NavLink
          to="/job"
          className={({ isActive }) =>
            `py-1 uppercase ${
              isActive
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-700 hover:text-teal-500"
            }`
          }
        >
          <li>Job</li>
        </NavLink>
        <NavLink
          to="/survey"
          className={({ isActive }) =>
            `py-1 uppercase ${
              isActive
                ? "text-teal-500 border-b-2 border-teal-500"
                : "text-gray-700 hover:text-teal-500"
            }`
          }
        >
          <li>Survey</li>
        </NavLink>
      </ul>

      {/* User Profile Section */}
      <div className="flex items-center gap-4">
        {!isLoading && (
          <>
            {localStorage.getItem("token") && userData ? (
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={
                    userData.profile_image
                      ? `${userData.profile_image}`
                      : assets.profile_pic
                  }
                  alt={`${userData.first_name}'s profile`}
                />
                <span className="hidden md:block text-gray-700">
                  {userData.first_name} {userData.last_name}
                </span>
                <img
                  className="w-2.5"
                  src={assets.dropdown_icon}
                  alt="Dropdown"
                />

                {/* Dropdown Menu */}
                <div className="absolute top-0 right-0 pt-14 font-medium text-gray-600 z-20 hidden group-hover:block">
                  <div className="bg-stone-100 rounded flex flex-col gap-4 p-4">
                    {userData.isAdmin ? (
                      <p
                        onClick={() => navigate("/dashboard")}
                        className="hover:text-black cursor-pointer"
                      >
                        Dashboard
                      </p>
                    ) : (
                      <p
                        onClick={() => navigate("/profile")}
                        className="hover:text-black cursor-pointer"
                      >
                        Profile
                      </p>
                    )}
                    <p
                      onClick={handleLogout}
                      className="hover:text-black cursor-pointer"
                    >
                      LogOut
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/createaccount")}
                  className="bg-teal-500 text-white px-4 py-2 rounded-full"
                >
                  Create Account
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className={`md:hidden ${showMenu ? "hidden" : "block"}`}>
        <button onClick={() => setShowMenu(!showMenu)}>
          <RxHamburgerMenu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
          <div className="flex justify-end p-4">
            <button onClick={() => setShowMenu(false)}>
              <IoCloseOutline className="w-6 h-6 text-white" />
            </button>
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium text-white">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded inline-block ${
                  isActive
                    ? "text-teal-500 bg-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <p>Home</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/event"
              className={({ isActive }) =>
                `px-4 py-2 rounded inline-block ${
                  isActive
                    ? "text-teal-500 bg-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <p>Event</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/alumni"
              className={({ isActive }) =>
                `px-4 py-2 rounded inline-block ${
                  isActive
                    ? "text-teal-500 bg-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <p>Alumni</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/job"
              className={({ isActive }) =>
                `px-4 py-2 rounded inline-block ${
                  isActive
                    ? "text-teal-500 bg-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <p>Job</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/survey"
              className={({ isActive }) =>
                `px-4 py-2 rounded inline-block ${
                  isActive
                    ? "text-teal-500 bg-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <p>Survey</p>
            </NavLink>
            {isLoggedIn && userData?.isAdmin && (
              <NavLink onClick={() => setShowMenu(false)} to="/dashboard">
                <p className="bg-blue-300 px-4 py-2 rounded inline-block hover:scale-105 transition-all duration-300">
                  Dashboard
                </p>
              </NavLink>
            )}
            {!isLoggedIn && (
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/createaccount");
                }}
                className="bg-teal-500 font-semibold text-white px-4 py-2 rounded-full w-full"
              >
                Create Account
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
export default NavBar;
