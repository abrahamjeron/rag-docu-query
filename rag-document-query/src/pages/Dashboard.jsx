import React from "react";
import { auth } from "../firebaseCOnfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Remove all cookies
            Cookies.remove('userEmail');
            Cookies.remove('userName');
            Cookies.remove('userPhoto');
            Cookies.remove('userId');
            Cookies.remove('accessToken');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Get user info from cookies
    const userName = Cookies.get('userName');
    const userEmail = Cookies.get('userEmail');
    const userPhoto = Cookies.get('userPhoto');

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center space-x-4">
                                {userPhoto && (
                                    <img
                                        src={userPhoto}
                                        alt="Profile"
                                        className="h-12 w-12 rounded-full"
                                    />
                                )}
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Welcome, {userName || 'User'}
                                    </h2>
                                    <p className="text-sm text-gray-500">{userEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;