import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            console.log('AuthProvider: Checking auth...'); // Debug log
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const profile = await getUserProfile();
                    setUser(profile);
                    console.log('AuthProvider: User logged in', profile); // Debug log
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('authToken');
                    setError(error);
                }
            } else {
                console.log('AuthProvider: No token found'); // Debug log
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        console.log('AuthProvider: User logged out'); // Debug log
    };

    const value = {
        user,
        setUser,
        loading,
        logout,
        error
    };

    console.log('AuthProvider rendering', { loading, user }); // Debug log

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error.message}</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 