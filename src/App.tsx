import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import ProtectedRoute from './components/pages/Auth/ProtectedRoute';
import Dashboard from './components/pages/Dashboard/DashboardPage';
import MapView from './components/pages/MapView/MapView';
import LoginPage from './components/pages/Auth/LoginPage';
import NavMenu from './components/shared/NavMenu';

const App: React.FC = () => {
    return (
        <>
            <Router>
                <AuthProvider>
                    <NavMenu/>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/map" element={<MapView />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </>
    );
};

export default App;
