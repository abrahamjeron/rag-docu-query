import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Cookies from 'js-cookie'

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status when app loads
    const userId = Cookies.get('userId');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            Cookies.get('userId') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
