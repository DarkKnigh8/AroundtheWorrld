import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CountryDetailPage from './pages/CountryDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './contexts/AuthContext';
import { CountriesProvider } from './contexts/CountriesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  const [initializing, setInitializing] = useState(true);
  const cookies = new Cookies();
  
  // Check for saved theme preference
  useEffect(() => {
    // Give a tiny delay to avoid flash of wrong theme
    setTimeout(() => {
      setInitializing(false);
    }, 100);
  }, []);
  
  if (initializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CountriesProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/country/:countryCode" element={<CountryDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route 
                    path="/favorites" 
                    element={
                      <PrivateRoute>
                        <FavoritesPage />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/not-found" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CountriesProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;