import React, { useState, useEffect } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaCalendarAlt, FaBriefcase, FaPoll } from "react-icons/fa";
import api from "../../../api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    verifiedAlumni: 0,

    events: 0,
    jobs: 0,
    surveys: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="w-full grid-cols-[1fr] gap-4 grid sm:grid-cols-[1fr_1fr_1fr_1fr] grid-rows-[150px_150px_150px_150px] sm:grid-rows-[200px]">
        <div className="bg-teal-500 rounded-lg">
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <div className="font-bold text-white text-4xl flex items-center gap-2">
              <HiOutlineUserGroup className="text-3xl" />
              Total Alumni
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.verifiedAlumni}
            </div>
          </div>
        </div>

        <div className="bg-red-400 rounded-lg">
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <div className="font-bold text-white text-4xl flex items-center gap-2">
              <FaPoll className="text-3xl" />
              Total Surveys
            </div>
            <div className="text-3xl font-bold text-white">{stats.surveys}</div>
          </div>
        </div>

        <div className="bg-blue-500 rounded-lg">
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <div className="font-bold text-white text-4xl flex items-center gap-2">
              <FaCalendarAlt className="text-3xl" />
              Total Events
            </div>
            <div className="text-3xl font-bold text-white">{stats.events}</div>
          </div>
        </div>

        <div className="bg-orange-500 rounded-lg">
          <div className="flex flex-col justify-center items-center h-full gap-4">
            <div className="font-bold text-white text-4xl flex items-center gap-2">
              <FaBriefcase className="text-3xl" />
              Total Jobs
            </div>
            <div className="text-3xl font-bold text-white">{stats.jobs}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
