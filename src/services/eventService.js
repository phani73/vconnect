// services/eventService.js
import axios from "axios";

const BASE_URL = "http://localhost:8081/api/events";

const getTokenHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});

export const eventService = {
  // Get all events (for Home Page)
  getAllEvents: async () => {
    const res = await fetch("http://localhost:8081/api/events", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch events");
    return res.json(); // returns EventWithJoinStatus[]
  },

  // Get events created or joined by a specific user
  getUserEvents: async (userId) => {
    const token = localStorage.getItem("token"); // or however you store it
    return axios.get(`http://localhost:8081/api/events/user-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => res.data);
  },
  

  // Join an event
  joinEvent: async (eventId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/${eventId}/join`,
        {},
        getTokenHeader()
      );
      return res.data;
    } catch (err) {
      console.error("🔴 joinEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Leave an event
  leaveEvent: async (eventId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/${eventId}/leave`,
        {},
        getTokenHeader()
      );
      return res.data;
    } catch (err) {
      console.error("🔴 leaveEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Create a new event (Organizer only)
  createEvent: async (formData) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("🔴 createEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  // Get event by ID (for Edit)
  getEventById: async (eventId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${eventId}`, getTokenHeader());
      return response.data;
    } catch (err) {
      console.error(
        "🔴 getEventById error:",
        err.response?.data || err.message
      );
      throw err;
    }
  },

  // Update an existing event (Organizer only)
  updateEvent: async (eventId, formData) => {
    try {
      const res = await axios.put(`${BASE_URL}/${eventId}/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data;
    } catch (err) {
      console.error("🔴 updateEvent error:", err.response?.data || err.message);
      throw err;
    }
  },

  downloadParticipantsExcel: async (eventId) => {
    const response = await fetch(`/api/events/${eventId}/participants/export`, {
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) throw new Error("Download failed");
    return await response.blob(); // For Excel
  },

  // Delete an event (Organizer only)
  deleteEvent: async (eventId) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/${eventId}`,
        getTokenHeader()
      );
      return res.data;
    } catch (err) {
      console.error("🔴 deleteEvent error:", err.response?.data || err.message);
      throw err;
    }
  },
};
