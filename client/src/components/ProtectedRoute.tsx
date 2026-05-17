import React from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../utils/constants';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    if (!token) {
        return <Navigate to="/signIn" replace />;
    }
    return <>{children}</>;
}