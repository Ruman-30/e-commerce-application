import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/axios"; // your axios instance
import { setUser, setLoading, setError } from "../../features/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warning("Please fill all fields");
      return;
    }

    try {
      dispatch(setLoading(true));

      // Login request
      const res = await api.post("/auth/login", formData, {
        withCredentials: true,
      });

      // Set user directly from response
      dispatch(setUser({ user: res.data.user }));

      toast.success("Login successful!");
      navigate("/"); // redirect to home
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login failed"));
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 px-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Sign In to <span className="text-yellow-500">UrbanCart</span>
        </h2>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>
     
        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          New to UrbanCart?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
