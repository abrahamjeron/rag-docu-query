import React, { useState, useEffect } from "react";
import { auth, db } from "../firebaseCOnfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { initializeAnalytics } from "firebase/analytics";

function Login() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if user is already logged in
        const userId = Cookies.get('userId');
        if (userId) {
            navigate('/dashboard');
        }
    }, [navigate]);
    
    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Store user details in cookies with 1 week expiry
            Cookies.set('userEmail', user.email, { expires: 7 });
            Cookies.set('userName', user.displayName, { expires: 7 });
            Cookies.set('userPhoto', user.photoURL, { expires: 7 });
            Cookies.set('userId', user.uid, { expires: 7 });
            
            // Store the access token
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            Cookies.set('accessToken', token, { expires: 7 });

            // Store user data in Firestore
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                // If user doesn't exist, create new document
                await setDoc(userRef, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    lastLogin: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    accessToken: token
                });
            } else {
                // If user exists, update last login
                await setDoc(userRef, {
                    lastLogin: new Date().toISOString()
                }, { merge: true });
            }

            navigate("/dashboard");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome
                    </h2>
                </div>
                {error && (
                    <div className="text-red-500 text-center text-sm">
                        {error}
                    </div>
                )}
                <div className="mt-8">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;