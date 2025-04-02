import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const userId = Cookies.get('userId');
    
    if (!userId) {
        // Redirect to login if no user ID cookie exists
        return <Navigate to="/" replace />;
    }

    // Render children if user is authenticated
    return children;
};

export default ProtectedRoute; 