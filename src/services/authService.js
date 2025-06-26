import { mockApi } from '../utils/mockApi';
import { generateToken } from '../utils/jwtUtils';

// Mock users database
const mockUsers = [
  {
    id: 1,
    name: 'Demo User',
    email: 'user@demo.com',
    password: 'password123',
    role: 'USER',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Event Organizer',
    email: 'organizer@demo.com',
    password: 'password123',
    role: 'ORGANIZER',
    createdAt: new Date('2024-01-02')
  },
  {
    id: 3,
    name: 'System Admin',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'ADMIN',
    createdAt: new Date('2024-01-03')
  }
];

let nextUserId = 4;

const authService = {
  login: async (credentials) => {
    await mockApi.delay();
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  },

  signup: async (userData) => {
    await mockApi.delay();
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: nextUserId++,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'USER',
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    const token = generateToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    };
  },

  logout: () => {
    // In a real app, you might want to invalidate the token on the server
    return Promise.resolve();
  },

  getCurrentUser: async (token) => {
    await mockApi.delay();
    // In a real app, this would validate the token with the server
    return { success: true };
  }
};

export { authService };