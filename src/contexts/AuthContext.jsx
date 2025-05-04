import React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  
  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = cookies.get('auth_token');
        
        if (token) {
          // Verify token hasn't expired
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp > currentTime) {
            // For demo purposes, we'll just use the decoded token
            // In a real app, you'd verify with your backend
            setCurrentUser({
              id: decodedToken.sub,
              email: decodedToken.email,
              name: decodedToken.name || 'User'
            });
          } else {
            // Token expired
            cookies.remove('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        cookies.remove('auth_token');
      } finally {
        setLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, []);
  
  // Login function - in a real app, this would communicate with your backend
  const login = async (email, password) => {
    try {
      // Simulate API call for demo purposes
      // In a real app, replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Simulated successful response with JWT token
          if (email === 'user@example.com' && password === 'password') {
            resolve({
              status: 200,
              data: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IkRlbW8gVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjYyODYzNDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                user: {
                  id: '1234567890',
                  email: 'user@example.com',
                  name: 'Demo User'
                }
              }
            });
          } else {
            // Simulated error
            const error = new Error('Invalid credentials');
            error.response = { status: 401 };
            throw error;
          }
        }, 500);
      });
      
      // Store token in cookies
      cookies.set('auth_token', response.data.token, { 
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict'
      });
      
      // Set user in state
      setCurrentUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false,
        message: error.response?.status === 401 
          ? 'Invalid email or password' 
          : 'An error occurred during login. Please try again.'
      };
    }
  };
  
  // Register function - in a real app, this would communicate with your backend
  const register = async (name, email, password) => {
    try {
      // Simulate API call for demo purposes
      // In a real app, replace this with your actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          // Simulated successful registration
          resolve({
            status: 201,
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5ODc2NTQzMjEwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwibmFtZSI6IkRlbW8gVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjYyODYzNDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
              user: {
                id: '9876543210',
                email: email,
                name: name
              }
            }
          });
        }, 500);
      });
      
      // Store token in cookies
      cookies.set('auth_token', response.data.token, { 
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict'
      });
      
      // Set user in state
      setCurrentUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false,
        message: error.response?.status === 409
          ? 'Email already exists'
          : 'An error occurred during registration. Please try again.'
      };
    }
  };
  
  // Logout function
  const logout = () => {
    cookies.remove('auth_token', { path: '/' });
    setCurrentUser(null);
  };
  
  const value = {
    currentUser,
    loading,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};