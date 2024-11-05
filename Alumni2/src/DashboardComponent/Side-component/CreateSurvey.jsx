import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api.js";

const CreateSurvey = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    survey_title: "",
    description: "",
    survey_link: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "image" ? files[0] : value,
    });
  };
  const inputStyle =
    "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-2 block";
  const headerStyle =
    "bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white";
  const buttonStyle =
    "w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-800 transform hover:scale-[1.02] transition-all duration-300";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = new FormData();
    for (const key in formData) {
      if (key === "image" && formData[key]) {
        surveyData.append(key, formData[key], formData[key].name);
      } else {
        surveyData.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create a survey.");
        return;
      }
      await api.post("/surveys", surveyData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Survey created successfully!");
      setFormData({
        survey_title: "",
        description: "",
        survey_link: "",
        image: null,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating survey:", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else {
          toast.error(
            `Failed to create survey: ${
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
          "Failed to create survey. Please check your network connection and try again."
        );
      }
    }
  };
  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className={headerStyle}>
            <h2 className="text-3xl font-bold">Create New Survey</h2>
            <p className="mt-2 opacity-90">
              Fill in the details to create a new survey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Survey Title */}
              <div className="col-span-2">
                <label className={labelStyle}>Survey Title</label>
                <input
                  type="text"
                  name="survey_title"
                  value={formData.survey_title}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className={labelStyle}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={inputStyle}
                  required
                ></textarea>
              </div>

              {/* Survey Link */}
              <div className="col-span-2">
                <label className={labelStyle}>Survey Link</label>
                <input
                  type="url"
                  name="survey_link"
                  value={formData.survey_link}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className={labelStyle}>Survey Image</label>
                <div
                  className={`relative group cursor-pointer rounded-lg overflow-hidden
                  ${
                    formData.image
                      ? "border-2 border-teal-500"
                      : "border-2 border-dashed border-gray-300"
                  }
                  hover:border-teal-500 transition-all duration-300`}
                >
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="space-y-1 text-center p-8">
                    {formData.image ? (
                      <>
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Survey Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-md"
                        />
                        <p className="text-sm text-teal-600">
                          Survey image selected
                        </p>
                      </>
                    ) : (
                      <>
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          <span className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500">
                            Upload Survey Image
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit" className={buttonStyle}>
                Create Survey
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSurvey;
