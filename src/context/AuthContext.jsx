import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { decodeToken } from '../utils/jwtUtils';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...initialState,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeToken(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: decoded,
              token: token
            }
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials) => {
    const response = await axios.post('http://localhost:8081/api/auth/login', credentials);
    const { token } = response.data;
  
    const decoded = decodeToken(token);
    localStorage.setItem('token', token);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user: {
          id: decoded.id,
          email: decoded.email,
          // 👇 Normalize backend role here
          role: decoded.role.replace('ROLE_', '') // ✅ this is correct
        },
        token
      }
    });
  
    // ❌ Missing this return (it's important!)
    return response.data;
  };
  ;
    
  
  
  const signup = async (userData) => {
    await axios.post('http://localhost:8081/api/auth/signup', userData);
    return login({ email: userData.email, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
