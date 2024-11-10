import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/pages/Auth/ProtectedRoute';
import Dashboard from './components/pages/Dashboard/DashboardPage';
import MapView from './components/pages/MapView/MapView';
import LoginPage from './components/pages/Auth/LoginPage';
import NavMenu from './components/shared/NavMenu';
import FeedPage from './components/pages/Feed/FeedPage';
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from './components/shared/AppSidebar';
import { SidebarTrigger } from './components/ui/sidebar';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Router>
                <AuthProvider>
                    <NavMenu />
                    <SidebarProvider defaultOpen={false}>
                        <div className="flex flex-1">
                            <div className="flex-1 p-4">
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
                                    <Route
                                        path="/feed"
                                        element={
                                            <ProtectedRoute>
                                                <FeedPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route path="/map" element={<MapView />} />
                                </Routes>
                            </div>
                        </div>
                    </SidebarProvider>
                </AuthProvider>
            </Router>
        </div>
    );
};

export default App;
