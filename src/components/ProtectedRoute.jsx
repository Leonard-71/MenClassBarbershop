import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5050/api/loggeduser/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.role === requiredRole) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Eroare la preluarea detaliilor utilizatorului:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [requiredRole]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/despre" />;
};

export default ProtectedRoute;
