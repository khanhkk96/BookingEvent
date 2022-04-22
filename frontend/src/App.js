import './App.css';
import './components/Navigation/MainNavigation.css';

import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventPage from './pages/Events';
import BookingPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import React, { useState } from 'react';
import AuthContext from './context/auth-context';

function App() {
    const [state, setState] = useState({ token: null, userId: null });

    function login(token, userId, tokenExpiration) {
        setState({ token, userId });
    }

    function logout() {
        setState({ token: null, userId: null });
    }

    return (
        <BrowserRouter>
            <AuthContext.Provider
                value={{
                    token: state.token,
                    userId: state.userId,
                    login,
                    logout,
                }}
            >
                <MainNavigation />
                <main className="main-content">
                    <Routes>
                        {!state.token && <Route path="/" element={<Navigate to="/auth" replace />} />}
                        {state.token && <Route path="/" element={<Navigate to="/events" replace />} />}
                        {state.token && <Route path="/auth" element={<Navigate to="/events" replace />} />}
                        {!state.token && <Route path="/auth" element={<AuthPage />} />}
                        <Route path="/events" element={<EventPage />} />
                        {state.token && <Route path="/bookings" element={<BookingPage />} />}
                    </Routes>
                </main>
            </AuthContext.Provider>
        </BrowserRouter>
    );
}

export default App;
