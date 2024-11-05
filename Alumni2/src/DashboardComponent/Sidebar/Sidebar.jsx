import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoGrid, IoDocumentText } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { FaUser, FaDollarSign, FaBell } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";

import { FcSurvey } from "react-icons/fc";

const Sidebar = ({ isSidebarOpen }) => {
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);

  const [isSurveyDropOpen, setSurveyIsDropdownOpen] = useState(false);
  const [isAlumniListDropOpen, setIsAlumniListDropOpen] = useState(false);

  const toggleEventDropdown = () => {
    setIsEventDropdownOpen(!isEventDropdownOpen);
  };
  const toggleAlumniDropdown = () => {
    setIsAlumniListDropOpen(!isAlumniListDropOpen);
  };

  const toggleSurveyDropdown = () => {
    setSurveyIsDropdownOpen(!isSurveyDropOpen);
  };

  const toggleJobDropdown = () => {
    setIsJobDropdownOpen(!isJobDropdownOpen);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-28 bg-white border-r border-gray-200 sm:translate-x-0 transition-transform ${
        isSidebarOpen ? " translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-bold">
          <li>
            <NavLink
              to=""
              className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
            >
              <IoGrid className="mr-2" />
              DashBoard
            </NavLink>
          </li>

          {/* Event Dropdown */}
          <li>
            <div>
              <button
                onClick={toggleEventDropdown}
                className="p-2 text-gray-900 flex items-center justify-between hover:bg-gray-100 rounded-lg w-full"
              >
                <div className="flex items-center">
                  <SlCalender className="mr-2" />
                  Event
                </div>
                <span
                  className={`${
                    isEventDropdownOpen ? "rotate-180" : ""
                  } transition-transform`}
                >
                  &#9660; {/* Arrow icon */}
                </span>
              </button>
              {isEventDropdownOpen && (
                <ul className="ml-6 mt-2 space-y-2">
                  <li>
                    <NavLink
                      to="createevent"
                      className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
                    >
                      Create Event
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="manageevent"
                      className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
                    >
                      Manage Event
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </li>

          {/* Job Dropdown */}
          <li>
            <button
              onClick={toggleJobDropdown}
              className="p-2 text-gray-900 flex items-center justify-between hover:bg-gray-100 rounded-lg w-full"
            >
              <div className="flex items-center">
                <IoDocumentText className="mr-2" />
                Job
              </div>
              <span
                className={`${
                  isJobDropdownOpen ? "rotate-180" : ""
                } transition-transform`}
              >
                &#9660; {/* Arrow icon */}
              </span>
            </button>
            {isJobDropdownOpen && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <NavLink
                    to="createjob"
                    className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
                  >
                    Create Job
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="managejob"
                    className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
                  >
                    Manage Job
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              onClick={toggleSurveyDropdown} // Using the new toggle function
              className="p-2 text-gray-900 flex items-center justify-between hover:bg-gray-100 rounded-lg w-full"
            >
              <div className="flex items-center">
                <FcSurvey className="mr-2 " />
                Survey
              </div>
              <span
                className={`${
                  isSurveyDropOpen ? "rotate-180" : ""
                } transition-transform`}
              >
                &#9660; {/* Arrow icon */}
              </span>
            </button>
            {isSurveyDropOpen && ( // Render dropdown items when open
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <NavLink
                    to="createsurvey"
                    className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
                  >
                    Create Survey
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="managesurvey"
                    className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
                  >
                    Manage Survey
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink
              to="profile"
              className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
            >
              <FaUser className="mr-2" />
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="manageuser"
              className="p-2 text-gray-900 flex items-center hover:bg-gray-100 rounded-lg"
            >
              <HiOutlineUserGroup className="mr-2" />
              Alumni
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
