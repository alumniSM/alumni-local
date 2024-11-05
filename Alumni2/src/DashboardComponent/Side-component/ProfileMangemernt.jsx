import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import {
  FaUser,
  FaBuilding,
  FaGraduationCap,
  FaLinkedin,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Failed to fetch user profile. Please try again later.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setProfileImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      const formData = new FormData();
      const allowedFields = [
        "first_name",
        "middle_name",
        "last_name",
        "department",
        "batch",
        "linkedin_profile",
      ];
      allowedFields.forEach((field) => {
        if (user[field]) {
          formData.append(field, user[field]);
        }
      });

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await api.patch("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      // Trigger a custom event to notify navbar of profile update
      const profileUpdateEvent = new CustomEvent("profileUpdated", {
        detail: response.data,
      });
      window.dispatchEvent(profileUpdateEvent);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const inputStyle =
    "w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all";
  const labelStyle = "text-sm font-semibold text-gray-700 mb-2 block";
  const buttonStyle =
    "w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-800 transform hover:scale-[1.02] transition-all duration-300";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!user)
    return <div className="text-center p-4">No user data available.</div>;

  return (
    <div className="w-full h-full p-6">
      <ToastContainer />
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Profile Management
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-0">
              {user.profile_image ? (
                <img
                  src={user.profile_image} // Cloudinary URL will be returned directly from backend
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full ring-2 ring-teal-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-teal-500 flex items-center justify-center">
                  <FaUser className="text-3xl text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer hover:bg-teal-600 transition-colors">
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Fields */}
            <div>
              <label className={labelStyle}>First Name</label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={user.middle_name || ""}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin_profile"
                value={user.linkedin_profile}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            {/* Academic Fields */}
            <div>
              <label className={labelStyle}>Department</label>
              <input
                type="text"
                name="department"
                value={user.department}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Batch</label>
              <input
                type="text"
                name="batch"
                value={user.batch}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button type="submit" className={buttonStyle}>
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
