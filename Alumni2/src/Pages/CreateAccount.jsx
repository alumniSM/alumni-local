import React, { useState } from "react";
import api from "../../api";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaLinkedin,
  FaFileUpload,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "male",
    email: "",
    password: "",
    department: "",
    batch: "",
    linkedin_profile: "",
  });
  const [tempDocument, setTempDocument] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      const error = validatePassword(value);
      setPasswordError(error);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG and PNG files are allowed");
      e.target.value = "";
      return;
    }

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      e.target.value = "";
      return;
    }

    setTempDocument(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tempDocument) {
      toast.error("Please upload a temporary document");
      return;
    }

    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error("Please fix the password validation errors");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append document with proper mime type
      formDataToSend.append("tempDocument", tempDocument);

      const response = await api.post("/users/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        "Account created successfully! Please wait for admin approval.",
        {
          position: "top-center",
        }
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error details:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-center",
      });
    }
  };
  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 14) {
      return "Password must be between 8 and 14 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Add departments array
  const departments = [
    "Information Technology",
    "Information System",
    "Computer Science",
    "Software Engineering",
  ];

  return (
    <section className="mt-10 px-6 md:px-10 lg:px-20 flex flex-col items-center justify-center min-h-screen bg-white">
      <ToastContainer />
      <div className="w-full md:w-2/3 bg-white p-8 border border-spacing-4">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              First Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                placeholder="First Name"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Middle Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                placeholder="Middle Name"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Last Name <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                placeholder="Last Name"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                placeholder="Email"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Department <span className="text-red-600">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Batch <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700"
              placeholder="Batch"
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tempo Image for Verification
              <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                accept="image/jpeg,image/png,image/jpg"
                required
              />
            </div>
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              LinkedIn Profile
            </label>
            <div className="relative">
              <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                name="linkedin_profile"
                value={formData.linkedin_profile}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                placeholder="LinkedIn Profile URL"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2 border rounded-md text-gray-700 ${
                  passwordError ? "border-red-500" : ""
                }`}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-500">{passwordError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Password must be 8-14 characters and contain at least one
              uppercase letter, one lowercase letter, and one number.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Already Have an Account?
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default CreateAccount;
