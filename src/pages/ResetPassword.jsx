// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");

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
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
