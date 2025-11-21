// src/App.jsx

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Game from "./pages/Game.jsx";
import Lobby from "./pages/Lobby.jsx";
import ModeSelect from "./pages/ModeSelect.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation(); // <--- We use this to check the current page

    // Check if we are on the login page
    const isLoginPage = location.pathname === "/";

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const userDocRef = doc(db, "users", user.uid);
                onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUsername(docSnap.data().username || "");
                    }
                });

                // If user is logged in but on the login page, send them to menu
                if (location.pathname === "/") {
                    navigate("/mode-select");
                }

            } else {
                setCurrentUser(null);
                setUsername("");
                // If user is logged out, send them to login
                if (location.pathname !== "/") {
                    navigate("/");
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]); // Removed location dependence to prevent loops

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    if (loading) {
        return (
            <div className="bg-[#023e8a] text-white min-h-screen p-4 flex justify-center items-center font-sans">
                <h2 className="text-2xl">Loading Mathemix...</h2>
            </div>
        );
    }

    return (
        // FIX: Only apply the Blue Background and Padding if we are NOT on the Login Page
        <div className={isLoginPage ? "font-nunito" : "bg-[#023e8a] text-white min-h-screen p-4 font-sans"}>

            {/* FIX: Only apply the centered max-width container if we are NOT on the Login Page */}
            <div className={isLoginPage ? "" : "max-w-4xl mx-auto text-center"}>

                {/* Header (Only show if logged in and NOT on login page) */}
                {!isLoginPage && currentUser && (
                    <header className="border-b border-gray-600 pb-4 mb-6 relative">
                        <button
                            onClick={handleLogout}
                            className="absolute top-0 right-0 bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                            Logout
                        </button>
                        <h1 className="text-4xl font-bold tracking-wider">Mathemix 🧮</h1>
                    </header>
                )}

                {/* ROUTER SWITCHING */}
                <Routes>
                    {/* Route: Login Page (Root) */}
                    <Route path="/" element={<LoginPage />} />

                    {/* Route: Mode Selection */}
                    <Route path="/mode-select" element={<ModeSelect username={username} />} />

                    {/* Route: Solo Game */}
                    <Route path="/game" element={<Game />} />

                    {/* Route: Multiplayer Lobby */}
                    <Route path="/lobby" element={<Lobby user={currentUser} />} />
                </Routes>

            </div>
        </div>
    );
}

export default App;