import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, MapPin, Search } from 'lucide-react';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* 404 Animation */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center"
            >
              <Search className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          
          {/* VConnect Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              VConnect
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have wandered off to help in the community.
          </p>
          <p className="text-gray-500">
            Let's get you back to discovering amazing local events and volunteer opportunities!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button 
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Discover Events
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Join VConnect
            </button>
          </div>
        </motion.div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-32 right-16 w-6 h-6 bg-emerald-400 rounded-full opacity-60"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 3, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-32 left-20 w-5 h-5 bg-orange-400 rounded-full opacity-60"
          />
        </div>
      </div>
    </div>
  );
}

export default NotFound;