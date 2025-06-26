import { mockApi } from '../utils/mockApi';

// Mock events database
let mockEvents = [
  {
    id: 1,
    title: 'Community Blood Donation Drive',
    description: 'Join us for a life-saving blood donation event. Help save lives in our community by donating blood. All blood types are needed, and every donation can save up to three lives.',
    location: 'Community Center, Main Street',
    latitude: 40.7128,
    longitude: -74.0060,
    date: new Date('2024-02-15T10:00:00'),
    category: 'DONATION',
    organizer: { id: 2, name: 'Red Cross NYC' },
    registeredCount: 45,
    maxCapacity: 100,
    imageUrl: 'https://images.pexels.com/photos/6823616/pexels-photo-6823616.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    title: 'Beach Cleanup Volunteer Day',
    description: 'Help keep our beaches clean and protect marine life. Bring gloves and a positive attitude! We\'ll provide all cleaning supplies and refreshments.',
    location: 'Sunset Beach, Coastal Highway',
    latitude: 40.7580,
    longitude: -73.9855,
    date: new Date('2024-02-20T08:00:00'),
    category: 'VOLUNTEER',
    organizer: { id: 2, name: 'Ocean Conservation Group' },
    registeredCount: 28,
    maxCapacity: 50,
    imageUrl: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-12')
  },
  {
    id: 3,
    title: 'Local Food Bank Distribution',
    description: 'Volunteer to help distribute food to families in need. Make a direct impact in fighting hunger in our community.',
    location: 'Central Food Bank, 5th Avenue',
    latitude: 40.7505,
    longitude: -73.9934,
    date: new Date('2024-02-18T14:00:00'),
    category: 'VOLUNTEER',
    organizer: { id: 2, name: 'City Food Bank' },
    registeredCount: 32,
    maxCapacity: 40,
    imageUrl: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 4,
    title: 'Community Garden Planting Day',
    description: 'Join us in beautifying our neighborhood! Help plant flowers, vegetables, and herbs in our community garden.',
    location: 'Riverside Community Garden',
    latitude: 40.7282,
    longitude: -74.0776,
    date: new Date('2024-02-25T09:00:00'),
    category: 'COMMUNITY',
    organizer: { id: 2, name: 'Green Neighborhood Initiative' },  
    registeredCount: 18,
    maxCapacity: 30,
    imageUrl: 'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-18')
  },
  {
    id: 5,
    title: 'Senior Citizens Tech Workshop',
    description: 'Help teach senior citizens how to use smartphones and tablets. Share your tech knowledge and make meaningful connections.',
    location: 'Senior Community Center',
    latitude: 40.7614,
    longitude: -73.9776,
    date: new Date('2024-02-22T13:00:00'),
    category: 'VOLUNTEER',
    organizer: { id: 2, name: 'Tech for Seniors' },
    registeredCount: 12,
    maxCapacity: 25,
    imageUrl: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 6,
    title: 'Clothing Drive for Homeless Shelter',
    description: 'Donate warm clothing and help sort donations for our local homeless shelter. Every item makes a difference.',
    location: 'Hope Homeless Shelter',
    latitude: 40.7409,
    longitude: -74.0030,
    date: new Date('2024-02-28T11:00:00'),
    category: 'DONATION',
    organizer: { id: 2, name: 'Hope Shelter Foundation' },
    registeredCount: 22,
    maxCapacity: 35,
    imageUrl: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=600',
    createdAt: new Date('2024-01-22')
  }
];

let nextEventId = 7;
const userRegistrations = new Map(); // userId -> Set of eventIds

const eventService = {
  getAllEvents: async () => {
    await mockApi.delay();
    return mockEvents.map(event => ({
      ...event,
      date: event.date.toISOString()
    }));
  },

  getEventById: async (id) => {
    await mockApi.delay();
    const event = mockEvents.find(e => e.id === parseInt(id));
    if (!event) {
      throw new Error('Event not found');
    }
    return {
      ...event,
      date: event.date.toISOString()
    };
  },

  createEvent: async (eventData, userId) => {
    await mockApi.delay();
    
    const newEvent = {
      id: nextEventId++,
      ...eventData,
      date: new Date(eventData.date),
      organizer: { id: userId, name: 'Current User' },
      registeredCount: 0,
      createdAt: new Date(),
      imageUrl: eventData.imageUrl || 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    mockEvents.push(newEvent);
    return newEvent;
  },

  joinEvent: async (eventId, userId) => {
    await mockApi.delay();
    
    const event = mockEvents.find(e => e.id === parseInt(eventId));
    if (!event) {
      throw new Error('Event not found');
    }

    if (!userRegistrations.has(userId)) {
      userRegistrations.set(userId, new Set());
    }

    const userEvents = userRegistrations.get(userId);
    if (userEvents.has(parseInt(eventId))) {
      throw new Error('Already registered for this event');
    }

    if (event.registeredCount >= event.maxCapacity) {
      throw new Error('Event is full');
    }

    userEvents.add(parseInt(eventId));
    event.registeredCount++;

    return { success: true };
  },

  leaveEvent: async (eventId, userId) => {
    await mockApi.delay();
    
    const event = mockEvents.find(e => e.id === parseInt(eventId));
    if (!event) {
      throw new Error('Event not found');
    }

    const userEvents = userRegistrations.get(userId);
    if (!userEvents || !userEvents.has(parseInt(eventId))) {
      throw new Error('Not registered for this event');
    }

    userEvents.delete(parseInt(eventId));
    event.registeredCount--;

    return { success: true };
  },

  getUserEvents: async (userId) => {
    await mockApi.delay();
    
    const userEvents = userRegistrations.get(userId) || new Set();
    const registeredEvents = mockEvents.filter(e => userEvents.has(e.id));
    const createdEvents = mockEvents.filter(e => e.organizer.id === userId);

    return {
      registered: registeredEvents.map(event => ({
        ...event,
        date: event.date.toISOString()
      })),
      created: createdEvents.map(event => ({
        ...event,
        date: event.date.toISOString()
      }))
    };
  },

  updateEvent: async (eventId, eventData, userId) => {
    await mockApi.delay();
    
    const eventIndex = mockEvents.findIndex(e => e.id === parseInt(eventId));
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    const event = mockEvents[eventIndex];
    if (event.organizer.id !== userId) {
      throw new Error('Not authorized to update this event');
    }

    mockEvents[eventIndex] = {
      ...event,
      ...eventData,
      date: new Date(eventData.date)
    };

    return mockEvents[eventIndex];
  },

  deleteEvent: async (eventId, userId) => {
    await mockApi.delay();
    
    const eventIndex = mockEvents.findIndex(e => e.id === parseInt(eventId));
    if (eventIndex === -1) {
      throw new Error('Event not found');
    }

    const event = mockEvents[eventIndex];
    if (event.organizer.id !== userId) {
      throw new Error('Not authorized to delete this event');
    }

    mockEvents.splice(eventIndex, 1);
    return { success: true };
  },

  searchEvents: async (query) => {
    await mockApi.delay();
    
    const filteredEvents = mockEvents.filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );

    return filteredEvents.map(event => ({
      ...event,
      date: event.date.toISOString()
    }));
  },

  getEventsByCategory: async (category) => {
    await mockApi.delay();
    
    const filteredEvents = mockEvents.filter(event => event.category === category);
    return filteredEvents.map(event => ({
      ...event,
      date: event.date.toISOString()
    }));
  },

  getNearbyEvents: async (lat, lng, radius = 10) => {
    await mockApi.delay();
    
    // Simple distance calculation (in a real app, you'd use proper geolocation)
    const nearbyEvents = mockEvents.filter(event => {
      const distance = Math.sqrt(
        Math.pow(event.latitude - lat, 2) + Math.pow(event.longitude - lng, 2)
      );
      return distance < radius / 100; // Rough conversion for demo
    });

    return nearbyEvents.map(event => ({
      ...event,
      date: event.date.toISOString()
    }));
  }
};

export { eventService };