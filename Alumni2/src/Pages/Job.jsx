import React, { useState, useEffect } from "react";
import {
  FaLocationPin,
  FaBriefcase,
  FaBuilding,
  FaCalendar,
} from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import api from "../../api.js";
import { useAuth } from "../AuthContext";
import Modal from "./Modal";
import CreateJob from "../DashboardComponent/Side-component/CreateJob";

const Job = () => {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Job Opportunities
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exciting career opportunities posted by our alumni network
          </p>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-teal-500 py-3 px-6 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaBriefcase />
              Post New Job
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-3 w-full">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">
                      Title
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {job.title}
                    </h2>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500">
                      Company
                    </span>
                    <div className="flex items-center text-lg text-gray-700">
                      <FaBuilding className="mr-2 text-teal-500" />
                      {job.company_name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Description
                  </span>
                  <p className="text-base text-gray-600 line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">
                        Location
                      </span>
                      <div className="flex items-center text-gray-600">
                        <FaLocationPin className="mr-2 text-teal-500" />
                        {job.location}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-gray-500">
                        Deadline
                      </span>
                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2 text-teal-500" />
                        {new Date(job.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <FaBriefcase className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No job opportunities found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job"
      >
        <CreateJob
          onSuccess={() => {
            fetchJobs();
          }}
        />
      </Modal>
    </div>
  );
};

export default Job;
