import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api.js";

const CreateEvent = ({ onSuccess }) => {
  const inputStyle =
    "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-2 block";
  const headerStyle =
    "bg-gradient-to-r from-teal-500 to-teal-700 p-6 text-white";
  const buttonStyle =
    "w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-800 transform hover:scale-[1.02] transition-all duration-300";

  const [formData, setFormData] = useState({
    event_title: "",
    description: "",
    dateTime: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = new FormData();
    eventData.append("event_title", formData.event_title);
    eventData.append("description", formData.description);
    eventData.append("dateTime", formData.dateTime);
    eventData.append("location", formData.location);
    if (formData.image) {
      eventData.append("image", formData.image, formData.image.name);
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to create an event.");
        return;
      }

      await api.post("/events", eventData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event created successfully!");
      setFormData({
        event_title: "",
        description: "",
        dateTime: "",
        location: "",
        image: null,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response?.data?.message) {
        toast.error(`Failed to create event: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error(
          "No response received from server. Please check if the backend is running."
        );
      } else {
        toast.error(
          "Failed to create event. Please check your network connection and try again."
        );
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={headerStyle}>
            <h2 className="text-3xl font-bold">Create New Event</h2>
            <p className="mt-2 opacity-90">
              Fill in the details to create a new event
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Event Title
                </label>
                <input
                  type="text"
                  name="event_title"
                  value={formData.event_title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* DateTime */}
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                ></textarea>
              </div>

              {/* Location */}
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Event Image
                </label>
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
                  <div className="space-y-1 text-center">
                    {formData.image ? (
                      <>
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Event Preview"
                          className="mx-auto h-32 w-32 object-cover rounded-md"
                        />
                        <p className="text-sm text-purple-600">
                          Event image selected
                        </p>
                      </>
                    ) : (
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="text-sm text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                      >
                        <span>
                          {formData.image
                            ? "Change Image"
                            : "Upload Event Image"}
                        </span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-800 transform hover:scale-[1.02] transition-all duration-300"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
