import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, Menu, X, Plus, Calendar, Settings, LogOut, User } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleCreateClick = (e) => {
    if (!isOrganizer) {
      e.preventDefault();
      toast.error('Only organizers can create events');
    } else {
      navigate('/create-event');
    }
    setIsOpen(false); // Close mobile menu if open
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              VConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'font-medium text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Discover
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/create-event"
                  onClick={handleCreateClick}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1 ${
                    isActive('/create-event') 
                      ? 'font-medium text-emerald-600 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  } ${!isOrganizer ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </Link>
                <Link
                  to="/my-events"
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1 ${
                    isActive('/my-events') 
                      ? 'font-medium text-orange-600 bg-orange-50' 
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Events</span>
                </Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <p className="text-xs text-blue-600 font-medium">{user?.role}</p>
                      </div>
                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all transform hover:scale-105"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-lg transition-all ${
                  isActive('/') ? 'font-medium text-blue-600 bg-blue-50' : 'text-gray-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Discover Events
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/create-event"
                    onClick={handleCreateClick}
                    className={`block px-4 py-3 rounded-lg transition-all ${
                      isActive('/create-event') 
                        ? 'font-medium text-emerald-600 bg-emerald-50' 
                        : 'text-gray-600'
                    } ${!isOrganizer ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    Create Event
                  </Link>

                  <Link
                    to="/my-events"
                    className={`block px-4 py-3 rounded-lg transition-all ${
                      isActive('/my-events') ? 'font-medium text-orange-600 bg-orange-50' : 'text-gray-600'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    My Events
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className={`block px-4 py-3 rounded-lg transition-all ${
                        isActive('/admin') ? 'font-medium text-purple-600 bg-purple-50' : 'text-gray-600'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-3 text-center text-white bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
