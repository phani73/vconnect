// services/eventService.js
import axios from "axios";

const BASE_URL = "http://localhost:8081/api/events";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});

export const eventService = {
  // Get all events (Home Page)
  getAllEvents: async () => {
    try {
      const res = await axios.get(`${BASE_URL}`, getAuthHeader());
      return res.data; // Expecting EventWithJoinStatus[]
    } catch (err) {
      console.error(
        "🔴 getAllEvents error:",
        err.response?.data || err.message
      );
      throw new Error("Failed to fetch events");
    }
  },

  getEventById: async (eventId) => {
    try {
      const res = await axios.get(`${BASE_URL}/${eventId}`, getAuthHeader());
      return res.data; // should be a flat object now
    } catch (err) {
      console.error("🔴 getEventById error:", err.response?.data || err.message);
      throw new Error("Failed to fetch event");
    }
  },
  // Get events created and joined by user
  getUserEvents: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user-events`, getAuthHeader());
      return res.data || { created: [], registered: [] };
    } catch (err) {
      console.error("🔴 getUserEvents error:", err.response?.data || err.message);
      throw new Error("Failed to fetch user events");
    }
  },  

  // Get specific event by ID
  getEventDetails: async (eventId) => {
    try {
      const res = await axios.get(`${BASE_URL}/${eventId}`, getAuthHeader());
      return res.data; // { event, joined, registeredCount }
    } catch (err) {
      console.error(
        "🔴 getEventDetails error:",
        err.response?.data || err.message
      );
      throw new Error("Failed to fetch event details");
    }
  },

  // Join event
  joinEvent: async (eventId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/${eventId}/join`,
        {},
        getAuthHeader()
      );
      return res.data;
    } catch (err) {
      console.error("🔴 joinEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Leave event
  leaveEvent: async (eventId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/${eventId}/leave`,
        {},
        getAuthHeader()
      );
      return res.data;
    } catch (err) {
      console.error("🔴 leaveEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Create event
  createEvent: async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, formData, {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("🔴 createEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Update event
  updateEvent: async (eventId, formData) => {
    try {
      const res = await axios.put(`${BASE_URL}/${eventId}/edit`, formData, {
        ...getAuthHeader(),
        headers: {
          ...getAuthHeader().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err) {
      console.error("🔴 updateEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/${eventId}`, getAuthHeader());
      return res.data;
    } catch (err) {
      console.error("🔴 deleteEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Download participants as Excel
  downloadParticipantsExcel: async (eventId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/${eventId}/participants/export`,
        {
          ...getAuthHeader(),
          responseType: "blob",
        }
      );
      return res.data; // blob
    } catch (err) {
      console.error(
        "🔴 Excel download error:",
        err.response?.data || err.message
      );
      throw new Error("Failed to download Excel");
    }
  },

  // Get registered events (if needed separately)
  getRegisteredEvents: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/registered`, getAuthHeader());
      return res.data;
    } catch (err) {
      console.error(
        "🔴 getRegisteredEvents error:",
        err.response?.data || err.message
      );
      throw new Error("Failed to fetch registered events");
    }
  },
};
