// Mock API utilities for simulating backend responses

export const mockApi = {
  delay: (ms = 800) => new Promise(resolve => setTimeout(resolve, ms)),
  
  createResponse: (data, success = true, message = '') => ({
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  }),

  createError: (message, code = 400) => ({
    success: false,
    error: {
      message,
      code,
      timestamp: new Date().toISOString()
    }
  })
};