import React, { useState, useEffect} from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Users, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MapComponent from '../components/MapComponent';
import EventCard from '../components/EventCard';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [userLocation, setUserLocation] = useState(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const raw = await eventService.getAllEvents();
      console.log("Fetched event data from backend:", raw);
      setEvents(raw);
    } catch (error) {
      
      toast.error('Failed to load events');
      console.error("Event fetch error:", error); // Add this too
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    console.log(filterEvents)
    setFilteredEvents(filtered);
  };

const handleJoinEvent = async (eventId) => {
  if (!isAuthenticated) {
    toast.error('Please sign in to join events');
    navigate('/login');
    return;
  }

  try {
    await eventService.joinEvent(eventId);
    toast.success('Successfully joined the event!');
    await loadEvents(); // refresh all events from backend

  } catch (error) {
    toast.error('Failed to join event');
  }
};




  


  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Connect Through{' '}
              <span className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover local events, volunteer opportunities, and make a difference in your community
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All Categories</option>
                  <option value="VOLUNTEER">Volunteer Work</option>
                  <option value="DONATION">Donation Drives</option>
                  <option value="COMMUNITY">Community Events</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Grid
                </button>
                {/* <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Map
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'grid' ? (
            filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{filteredEvents.map((eventObj, index) => (
  <motion.div
    key={eventObj.id || index}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <EventCard
      event={eventObj}
      joined={eventObj.joined}
      onJoinRedirect={() => navigate(`/events/${eventObj.id}`)}
      showJoinButton={!eventObj.joined}
    />
  </motion.div>
))}

              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )
          ) : (
            <div className="h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-lg">
              <MapComponent
                events={filteredEvents}
                onEventClick={handleEventClick}
                center={userLocation}
                onLocationChange={setUserLocation}
              />
            </div>
          )}



        </div>
      </section>
    </div>
  );
}

export default Home;
