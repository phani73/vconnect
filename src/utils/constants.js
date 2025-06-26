export const ROLES = {
  USER: 'USER',
  ORGANIZER: 'ORGANIZER', 
  ADMIN: 'ADMIN'
};

export const EVENT_CATEGORIES = {
  VOLUNTEER: 'VOLUNTEER',
  DONATION: 'DONATION',
  COMMUNITY: 'COMMUNITY'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout'
  },
  EVENTS: {
    GET_ALL: '/api/events',
    GET_BY_ID: '/api/events',
    CREATE: '/api/events',
    UPDATE: '/api/events',
    DELETE: '/api/events',
    JOIN: '/api/events',
    LEAVE: '/api/events',
    NEARBY: '/api/events/nearby'
  },
  USERS: {
    GET_EVENTS: '/api/users'
  }
};

export const VALIDATION_RULES = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  TIME: 'h:mm a',
  FULL: 'MMM dd, yyyy h:mm a'
};