import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component protects routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected component
  return children;
};

export default ProtectedRoute;
