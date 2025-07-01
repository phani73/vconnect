import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Calendar, Plus, Users, MapPin, Clock,
  Edit3, Trash2, Eye, Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registered');
  const [events, setEvents] = useState({ created: [], registered: [] });
  const [loading, setLoading] = useState(true);


  const loadUserEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getUserEvents(user.id);
      setEvents({
        created: res?.created || [],
        registered: res?.registered || [],
      });
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      loadUserEvents();
    }
  }, [user]);
  
  

  // const loadUserEvents = async () => {
  //   try {
  //     setLoading(true);
  
  //     const data = await eventService.getUserEvents(user.id);
  //     setCreatedEvents(res.created);      // events created by user (organizer)
  //     setRegisteredEvents(res.registered); /
  //     setEvents({
  //       created: data?.created || [],
  //       registered: data?.registered || [],
  //     });
  
  //     console.log("Loaded events:", data);
  //     console.log("Parsed events:", {
  //       created: data?.created || [],
  //       registered: data?.registered || [],
  //     });
  
  //   } catch (error) {
  //     console.error('Failed to load events:', error);
  //     toast.error('Failed to load your events');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  



  const handleLeaveEvent = async (eventId) => {
    if (!confirm('Are you sure you want to leave this event?')) return;
    try {
      console.log(`User ${user.id} leaving event ${eventId}`);
      await eventService.leaveEvent(eventId, user.id);
      toast.success('Successfully left the event');
      loadUserEvents();
    } catch (error) {
      console.error('Failed to leave event:', error);
      toast.error('Failed to leave event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      console.log(`User ${user.id} deleting event ${eventId}`);
      await eventService.deleteEvent(eventId, user.id);
      toast.success('Event deleted successfully');
      loadUserEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
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

  const EventCard = ({ event, isCreated = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      {/* Event Image */}
      <div className="relative h-48">
        <img
          src={event.imageUrl || 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(event.category)}`}>
          {event.category}
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t ${getCategoryColor(event.category)} opacity-80`} />
      </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-emerald-500" />
              <span>{format(new Date(event.date), 'h:mm a')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-orange-500" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-purple-500" />
              <span>{event.registeredCount} / {event.maxCapacity} registered</span>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View Details</span>
          </button>

          <div className="flex items-center space-x-2">
            {isCreated ? (
              <>
                <button
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleLeaveEvent(event.id)}
                className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Leave Event
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log('Rendering MyEvents. Active tab:', activeTab);
  console.log('Events data:', events);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
              <p className="text-gray-600">Manage your registered and created events</p>
            </div>

            {(user.role === 'ORGANIZER' || user.role === 'ADMIN') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  console.log('Navigating to create-event page');
                  navigate('/create-event');
                }}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => {
              console.log('Switched to registered tab');
              setActiveTab('registered');
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'registered' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
          <Heart className="w-4 h-4" />
        <span>Registered ({events?.registered?.length || 0})</span>
        </div>

          </button>
          <button
            onClick={() => {
              console.log('Switched to created tab');
              setActiveTab('created');
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'created' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Created ({events.created.length})</span>
            </div>
          </button>
        </div>

        {activeTab === 'registered' && (
          <div key="registered-tab">
            {events.registered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.registered.map((event) => (
                  <EventCard key={event.id} event={event} isCreated={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Registered Events</h3>
                <p className="text-gray-500 mb-6">You haven't registered for any events yet.</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
                >
                  Discover Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'created' && (
          <div key="created-tab">
            {events.created.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.created.map((event) => (
                  <EventCard key={event.id} event={event} isCreated={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No Created Events</h3>
                <p className="text-gray-500 mb-6">You haven't created any events yet.</p>
                {(user.role === 'ORGANIZER' || user.role === 'ADMIN') ? (
                  <button
                    onClick={() => {
                      console.log('Clicked create your first event');
                      navigate('/create-event');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
                  >
                    Create Your First Event
                  </button>
                ) : (
                  <p className="text-sm text-gray-500">
                    You need organizer permissions to create events.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;
