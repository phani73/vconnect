import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Calendar, MapPin, Users, Clock, ArrowLeft, 
  Share2, Heart, User, Building2, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(id);
      setEvent(eventData);
    } catch (error) {
      toast.error('Failed to load event details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to join events');
      navigate('/login');
      return;
    }

    try {
      setJoining(true);
      await eventService.joinEvent(event.id, user.id);
      toast.success('Successfully joined the event!');
      loadEvent(); // Refresh event data
    } catch (error) {
      toast.error(error.message || 'Failed to join event');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'VOLUNTEER':
        return 'from-emerald-500 to-emerald-600';
      case 'DONATION':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'VOLUNTEER':
        return 'bg-emerald-100 text-emerald-700';
      case 'DONATION':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Event Not Found</h2>
          <p className="text-gray-500 mb-6">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Event Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(event.category)}`}>
                  {event.category}
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${getCategoryColor(event.category)} opacity-80`} />
              </div>

              {/* Event Content */}
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Date & Time</h3>
                      <p className="text-gray-600">
                        {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <p className="text-gray-600">
                        {format(new Date(event.date), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Capacity</h3>
                      <p className="text-gray-600">
                        {event.registeredCount} / {event.maxCapacity} registered
                      </p>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${(event.registeredCount / event.maxCapacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Organizer</h3>
                      <p className="text-gray-600">{event.organizer.name}</p>
                    </div>
                  </div>
                </div>

                {/* Requirements/Instructions */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-3">What to Expect</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Arrive 15 minutes early for check-in</li>
                    <li>• Bring a valid ID for registration</li>
                    <li>• Dress comfortably for the activity</li>
                    <li>• All materials and refreshments will be provided</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {event.registeredCount}
                </div>
                <div className="text-gray-600">People Registered</div>
              </div>

              {event.registeredCount >= event.maxCapacity ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Event Full</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    This event has reached maximum capacity.
                  </p>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinEvent}
                  disabled={joining || !isAuthenticated}
                  className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all ${
                    isAuthenticated
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {joining ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : isAuthenticated ? (
                    'Join This Event'
                  ) : (
                    'Sign In to Join'
                  )}
                </motion.button>
              )}

              {!isAuthenticated && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Sign in
                  </button>
                  {' or '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    create an account
                  </button>
                  {' to join this event'}
                </p>
              )}

              {/* Event Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Event Impact</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Expected Attendees</span>
                    <span className="font-medium">{event.maxCapacity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lives Impacted</span>
                    <span className="font-medium text-emerald-600">~{event.maxCapacity * 3}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Community Reach</span>
                    <span className="font-medium text-blue-600">High</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;