import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/pages/Auth/ProtectedRoute';
import Dashboard from './components/pages/Dashboard/DashboardPage';
import LoginPage from './components/pages/Auth/LoginPage';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
            <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
