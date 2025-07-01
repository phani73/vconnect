import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Calendar, MapPin, Users, ArrowLeft,
  Share2, Heart, Building2, AlertCircle, Download
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
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getEventById(id);
      const all = await eventService.getAllEvents();
  
      setEvent(eventData);
      setAllEvents(all.filter(e => e.id !== eventData.id));
  
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
  
    if (!event?.id) {
      toast.error('Invalid event. Cannot join.');
      return;
    }
  
    try {
      setJoining(true);
      await eventService.joinEvent(event.id);
      toast.success('Successfully joined the event!');
      navigate('/my-events');
      // ✅ Re-fetch the latest event data from backend
      const updatedEvent = await eventService.getEventById(event.id);
      setEvent(updatedEvent);
  
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response.data || 'You cannot join this event.');
      } else {
        toast.error(error.message || 'Failed to join event');
      }
    } finally {
      setJoining(false);
    }
  };
  
  

  const handleExport = async () => {
    try {
      const blob = await eventService.downloadParticipantsExcel(event.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participants_event_${event.id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Excel file downloaded');
    } catch (error) {
      toast.error('Failed to download Excel');
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
      } catch (error) {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'VOLUNTEER': return 'from-emerald-500 to-emerald-600';
      case 'DONATION': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getCategoryBadgeColor = (category) => {
    switch (category) {
      case 'VOLUNTEER': return 'bg-emerald-100 text-emerald-700';
      case 'DONATION': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
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

  const isUserOrganizer = event.organiser?.id === user?.id;

  const isJoined = event.isJoinedByUser;




  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex space-x-3">
            <button onClick={handleShare} className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
              <Share2 className="w-5 h-5" />
            </button>
            {isUserOrganizer && (
              <button onClick={handleExport} className="p-2 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg">
                <Download className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white shadow rounded-2xl overflow-hidden">
          <div className="relative h-64">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(event.category)}`}>
              {event.category}
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${getCategoryColor(event.category)} opacity-80`} />
          </div>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{event.description}</p>

            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="flex gap-3">
                <Calendar className="text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  {event.date && !isNaN(new Date(event.date)) ? (
  <>
    <p className="text-gray-600">{format(new Date(event.date), 'MMMM dd, yyyy')}</p>
    <p className="text-gray-600">{format(new Date(event.date), 'h:mm a')}</p>
  </>
) : (
  <p className="text-gray-500 italic">Date not available</p>
)}

                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Capacity</p>
                  <p className="text-gray-600">{event.registeredCount} / {event.maxCapacity} registered</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Building2 className="text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Organizer</p>
                  <p className="text-gray-600">{event.organiser?.name || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-24 bg-white shadow rounded-2xl p-6">
          <div className="text-center mb-6">
            <p className="text-3xl font-bold">{event.registeredCount}</p>
            <p className="text-gray-500">People Registered</p>
          </div>
          {event.registeredCount >= event.maxCapacity ? (
            <div className="bg-red-100 text-red-700 text-center py-3 rounded-lg font-medium mb-6">
              Event Full
            </div>
          ) : isJoined ? (
            <div className="bg-green-100 text-green-700 text-center py-3 rounded-lg font-medium mb-6">
              Already Joined
            </div>
          ) : (
            <button
              onClick={handleJoinEvent}
              disabled={joining || !isAuthenticated}
              className={`w-full py-3 rounded-xl font-medium text-lg transition-all ${
                isAuthenticated
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 shadow-lg'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {joining ? 'Joining...' : 'Join This Event'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
