import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const ProfileManagement = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
      toast.error("Failed to fetch user profile");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => {
        if (key !== "profile_image") {
          formData.append(key, user[key]);
        }
      });
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const response = await api.patch("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Profile Picture</label>
          {user.profile_image && (
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mb-2"
            />
          )}
          <input type="file" onChange={handleImageChange} accept="image/*" />
        </div>
        <div>
          <label className="block mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={user.department}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Batch</label>
          <input
            type="text"
            name="batch"
            value={user.batch}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">LinkedIn Profile</label>
          <input
            type="url"
            name="linkedin_profile"
            value={user.linkedin_profile}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileManagement;
