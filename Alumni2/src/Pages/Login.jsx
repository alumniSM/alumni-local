import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      const user = await axios.get("/users/profile");

      // Navigate based on user role
      if (user.data.isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      if (error.response?.data?.message?.includes("pending approval")) {
        toast.info("Your account is pending admin approval");
      } else if (error.response?.data?.message?.includes("password")) {
        toast.error("Invalid password");
      } else if (error.response?.data?.message?.includes("email")) {
        toast.error("Email not found");
      } else {
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
      <ToastContainer />
      <div className="w-full md:w-2/3 border border-spacing-8 bg-white p-8 rounded-3xl">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
                required
                className="w-full pl-10 px-4 py-2 border rounded-md text-gray-700"
                placeholder="example@example.com"
              />
            </div>
          </div>

          {/* Password with visibility toggle */}
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
                required
                className="w-full pl-10 pr-12 py-2 border rounded-md text-gray-700"
                placeholder="********"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/createaccount" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
