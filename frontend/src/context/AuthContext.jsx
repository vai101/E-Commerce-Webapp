import React, { createContext, useState, useContext } from 'react';
import apiClient from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('userInfo')) || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.post('/users/login', { email, password });
            
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('accessToken', data.accessToken);
            setUser(data);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            await apiClient.post('/users/register', { name, email, password });
            return { success: true, message: 'Registration successful. Check your email for verification!' };
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
   
        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
        setUser(null);

        apiClient.post('/users/logout');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};