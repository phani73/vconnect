import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Users, Calendar, TrendingUp, Activity, 
  MapPin, UserCheck, Shield, BarChart3,
  Eye, Edit3, Trash2, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { eventService } from '../services/eventService';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 2500,
    totalEvents: 0,
    totalRegistrations: 0,
    activeEvents: 0
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getAllEvents();
      setEvents(eventsData);
      
      // Calculate stats
      const totalRegistrations = eventsData.reduce((sum, event) => sum + event.registeredCount, 0);
      const activeEvents = eventsData.filter(event => new Date(event.date) > new Date()).length;
      
      setStats({
        totalUsers: 2500, // Mock data
        totalEvents: eventsData.length,
        totalRegistrations,
        activeEvents
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventService.deleteEvent(eventId, 1); // Admin override
      toast.success('Event deleted successfully');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const EventRow = ({ event }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={event.imageUrl || 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=600'}
            alt={event.title}
            className="w-10 h-10 rounded-lg object-cover mr-3"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{event.title}</div>
            <div className="text-sm text-gray-500">by {event.organizer.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          event.category === 'VOLUNTEER' ? 'bg-emerald-100 text-emerald-800' :
          event.category === 'DONATION' ? 'bg-orange-100 text-orange-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {event.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {format(new Date(event.date), 'MMM dd, yyyy')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {event.registeredCount} / {event.maxCapacity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          new Date(event.date) > new Date() ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {new Date(event.date) > new Date() ? 'Active' : 'Past'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button className="text-blue-600 hover:text-blue-900 p-1">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-emerald-600 hover:text-emerald-900 p-1">
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteEvent(event.id)}
            className="text-red-600 hover:text-red-900 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage platform activities and monitor system health</p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'events'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                change={12}
                color="bg-blue-500"
              />
              <StatCard
                icon={Calendar}
                title="Total Events"
                value={stats.totalEvents}
                change={8}
                color="bg-emerald-500"
              />
              <StatCard
                icon={UserCheck}
                title="Event Registrations"
                value={stats.totalRegistrations}
                change={25}
                color="bg-orange-500"
              />
              <StatCard
                icon={Activity}
                title="Active Events"
                value={stats.activeEvents}
                change={-5}
                color="bg-purple-500"
              />
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { type: 'event_created', user: 'Green Neighborhood Initiative', action: 'created', target: 'Community Garden Planting Day', time: '2 hours ago' },
                  { type: 'user_registered', user: 'Sarah Johnson', action: 'registered for', target: 'Beach Cleanup Volunteer Day', time: '4 hours ago' },
                  { type: 'event_updated', user: 'Tech for Seniors', action: 'updated', target: 'Senior Citizens Tech Workshop', time: '6 hours ago' },
                  { type: 'user_joined', user: 'Mike Chen', action: 'joined the platform', target: '', time: '8 hours ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'event_created' ? 'bg-emerald-100' :
                      activity.type === 'user_registered' ? 'bg-blue-100' :
                      activity.type === 'event_updated' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'event_created' && <Calendar className="w-4 h-4 text-emerald-600" />}
                      {activity.type === 'user_registered' && <UserCheck className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'event_updated' && <Edit3 className="w-4 h-4 text-orange-600" />}
                      {activity.type === 'user_joined' && <Users className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action} {activity.target && <span className="font-medium">{activity.target}</span>}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">All Events</h2>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>All Categories</option>
                    <option>VOLUNTEER</option>
                    <option>DONATION</option>
                    <option>COMMUNITY</option>
                  </select>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Past</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registrations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Platform Analytics</h2>
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                  <div className="text-sm text-gray-600">Event Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">4.8</div>
                  <div className="text-sm text-gray-600">Average Event Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
                  <div className="text-sm text-gray-600">User Retention Rate</div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volunteer Work</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-16 h-2 bg-emerald-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Donation Drives</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-12 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Community Events</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <span className="text-sm font-medium text-emerald-600">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Performance</span>
                    <span className="text-sm font-medium text-emerald-600">Optimal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Response Time</span>
                    <span className="text-sm font-medium text-blue-600">145ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="text-sm font-medium text-gray-900">1,247</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;