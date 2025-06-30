// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // assuming lucide-react is installed

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8081/api/auth/reset-password", null, {
        params: { token, newPassword: password }
      });
      toast.success("Password reset successful");
    } catch (err) {
      toast.error("Invalid or expired token");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg pr-12"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
