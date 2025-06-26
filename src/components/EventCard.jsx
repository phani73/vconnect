import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Heart } from 'lucide-react';
import { format } from 'date-fns';

function EventCard({ event, onJoin, showJoinButton = true }) {
  const navigate = useNavigate();

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

  const handleCardClick = (e) => {
    if (e.target.closest('.join-button')) return;
    navigate(`/events/${event.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl || `https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=600`}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(event.category)}`}>
          {event.category}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart className="w-4 h-4 text-gray-600" />
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${getCategoryColor(event.category)} opacity-80`} />
      </div>

      {/* Event Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {event.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-3 mb-6">
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
            <span>{event.registeredCount || 0} registered</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            by {event.organizer?.name || 'VConnect Organizer'}
          </div>
          
          {showJoinButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onJoin) onJoin(event.id);
              }}
              className="join-button px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
            >
              Join Event
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;