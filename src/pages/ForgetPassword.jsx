// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8081/api/auth/forgot-password', null, {
        params: { email }
      });
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data || 'Email not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required' })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
}
