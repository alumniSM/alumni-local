import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api.js";

const CreateJob = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    description: "",
    location: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/jobs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Job created successfully!");

      setFormData({
        title: "",
        company_name: "",
        description: "",
        location: "",
        deadline: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating job:", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else {
          toast.error(
            `Failed to create job: ${
              error.response.data.message || error.response.statusText
            }`
          );
        }
      } else if (error.request) {
        toast.error(
          "No response received from server. Please check if the backend is running."
        );
      } else {
        toast.error(
          "Failed to create job. Please check your network connection and try again."
        );
      }
    }
  };

  const inputStyle =
    "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-2 block";
  const headerStyle =
    "bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white";
  const buttonStyle =
    "w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-800 transform hover:scale-[1.02] transition-all duration-300";

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={headerStyle}>
            <h2 className="text-3xl font-bold">Create New Job Opportunity</h2>
            <p className="mt-2 opacity-90">
              Fill in the details to post a new job opening
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2 md:col-span-1">
                <label className={labelStyle}>
                  <FaBriefcase className="inline-block mr-2" />
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className={labelStyle}>
                  <FaBuilding className="inline-block mr-2" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="e.g., Tech Solutions Inc."
                  required
                />
              </div>

              <div className="col-span-2">
                <label className={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={inputStyle}
                  placeholder="Describe the job role, requirements, and responsibilities..."
                  required
                ></textarea>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className={labelStyle}>
                  <FaMapMarkerAlt className="inline-block mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="e.g. Bole"
                  required
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className={labelStyle}>
                  <FaCalendarAlt className="inline-block mr-2" />
                  Deadline
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" className={buttonStyle}>
                Post Job Opportunity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
