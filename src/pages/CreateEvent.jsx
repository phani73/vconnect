import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Type,
  Tag,
  Users,
  FileText,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MapComponent from '../components/MapComponent'; // adjust path as needed

function CreateEvent({ isEdit = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const selectedCategory = watch('category');

  useEffect(() => {
    if (isEdit && id) {
      const fetchEvent = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:8081/api/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const event = res.data.event; // ✅ fix here
  
          reset({
            title: event.title,
            description: event.description,
            category: event.category,
            maxCapacity: event.maxCapacity,
            date: event.date,
            time: event.time,
            location: event.location,
            latitude: event.latitude,
            longitude: event.longitude,
          });
  
          setExistingImage(event.imageUrl);
        } catch (err) {
          toast.error('Failed to load event');
        }
      };
  
      fetchEvent();
    }
  }, [isEdit, id, reset]);
  

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('maxCapacity', data.maxCapacity);
      formData.append('date', data.date);
      formData.append('time', data.time);
      formData.append('location', data.location);
      formData.append('latitude', data.latitude || '');
      formData.append('longitude', data.longitude || '');

      if (data.image?.length > 0) {
        formData.append('image', data.image[0]);
      }

      const token = localStorage.getItem('token');

      if (isEdit && id) {
        await axios.put(`http://localhost:8081/api/events/${id}/edit`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Event updated successfully!');
        navigate('/my-events', { state: { refreshCreated: true } });

      } else {
        await axios.post('http://localhost:8081/api/events/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success('Event created successfully!');
        navigate('/my-events', { state: { refreshCreated: true } });

      }

      setLoading(false);
      navigate('/my-events');
    } catch (error) {
      console.error('❌ Error occurred while submitting event:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit event');
      setLoading(false);
    }
  };
  const categoryOptions = [
    { value: 'VOLUNTEER', label: 'Volunteer Work', color: 'emerald' },
    { value: 'DONATION', label: 'Donation Drive', color: 'orange' },
    { value: 'COMMUNITY', label: 'Community Event', color: 'blue' },
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'VOLUNTEER':
        return 'border-emerald-300 bg-emerald-50';
      case 'DONATION':
        return 'border-orange-300 bg-orange-50';
      case 'COMMUNITY':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            </div>
          </div>
        </div>
      </div>
  
      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg"
        >
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Type className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('title', {
                          required: 'Event title is required',
                          minLength: { value: 5, message: 'Title must be at least 5 characters' }
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter a compelling event title"
                      />
                    </div>
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                  </div>
  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <div className="space-y-2">
                      {categoryOptions.map((category) => (
                        <label key={category.value} className="flex items-center">
                          <input
                            type="radio"
                            value={category.value}
                            {...register('category', { required: 'Category is required' })}
                            className="sr-only"
                          />
                          <div
                            className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedCategory === category.value
                                ? getCategoryColor(category.value)
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Tag
                                className={`h-5 w-5 ${
                                  selectedCategory === category.value
                                    ? `text-${category.color}-600`
                                    : 'text-gray-400'
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  selectedCategory === category.value
                                    ? `text-${category.color}-900`
                                    : 'text-gray-700'
                                }`}
                              >
                                {category.label}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                  </div>
  
                  {/* Max Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Capacity</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        {...register('maxCapacity', {
                          required: 'Maximum capacity is required',
                          min: { value: 1, message: 'Capacity must be at least 1' },
                          max: { value: 1000, message: 'Capacity cannot exceed 1000' }
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.maxCapacity ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 50"
                      />
                    </div>
                    {errors.maxCapacity && (
                      <p className="mt-1 text-sm text-red-600">{errors.maxCapacity.message}</p>
                    )}
                  </div>
                </div>
  
                {/* Description */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      rows={4}
                      {...register('description', {
                        required: 'Event description is required',
                        minLength: { value: 20, message: 'Description must be at least 20 characters' }
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Provide a detailed description..."
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
  
              {/* Location & Time */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Location & Time</h2>
  
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('location', { required: 'Event location is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.location ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter the full address or venue name"
                      />
                    </div>
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                  </div>
  
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date', { required: 'Event date is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.date ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                  </div>
  
                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        {...register('time', { required: 'Event time is required' })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.time ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                  </div>
                        
                  {/* Coordinates */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude (Optional)</label>
                    <input
                      type="number"
                      step="any"
                      {...register('latitude')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="40.7128"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude (Optional)</label>
                    <input
                      type="number"
                      step="any"
                      {...register('longitude')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="-74.0060"
                    />
                  </div>
                </div>
              </div>

              {watch('latitude') && watch('longitude') && (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Location Preview</h2>
    <div className="h-[300px] w-full">
      <MapComponent
        events={[{
          title: watch('title') || 'Event Preview',
          latitude: parseFloat(watch('latitude')),
          longitude: parseFloat(watch('longitude')),
          category: watch('category') || 'COMMUNITY',
        }]}
        center={{
          lat: parseFloat(watch('latitude')),
          lng: parseFloat(watch('longitude')),
        }}
        onEventClick={() => {}}
      />
    </div>
  </div>
)}
  
              {/* Upload Image */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Additional Details
                </h2>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Event Image
                </label>

                {existingImage && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img
                      src={existingImage}
                      alt="Event"
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  {...register('image', {
                    required: !isEdit ? 'Image is required' : false,
                  })}
                  className="w-full py-2 px-3 border border-gray-300 rounded-lg"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.image.message}
                  </p>
                )}
              </div>

  
              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isEdit ? 'Updating Event...' : 'Creating Event...'}
                    </div>
                  ) : (
                    isEdit ? 'Update Event' : 'Create Event'
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}  

export default CreateEvent;