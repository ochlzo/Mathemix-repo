// src/App.jsx

import React, { useState, useEffect } from "react";
import Game from "./Game.jsx";
import Lobby from "./Lobby.jsx";
import ModeSelect from "./ModeSelect.jsx";
import LoginPage from "./LoginPage.jsx";
import CreateAccountPage from "./CreateAccountPage.jsx";
import { QUESTIONS } from "./data.js"; // <--- FIXED: Changed '=>' to 'from'
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    const [gameMode, setGameMode] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const userDocRef = doc(db, "users", user.uid);
                const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setUsername(userData.username || "");
                        setLongestStreak(userData.longestStreak || 0);
                    }
                });
            } else {
                setCurrentUser(null);
                setUsername("");
                setLongestStreak(0);
                setCurrentStreak(0);
                setGameMode(null);
                setSelectedCategory(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth);
    };

    const handleSoloGameEnd = async (didWin) => {
        if (!currentUser) return;
        const userDocRef = doc(db, "users", currentUser.uid);

        if (didWin) {
            const newStreak = currentStreak + 1;
            setCurrentStreak(newStreak);
            if (newStreak > longestStreak) {
                setLongestStreak(newStreak);
                await setDoc(userDocRef, { longestStreak: newStreak }, { merge: true });
            }
        } else {
            setCurrentStreak(0);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#023e8a] text-white min-h-screen p-4 flex justify-center items-center font-sans">
                <h2 className="text-2xl">Loading Mathemix...</h2>
            </div>
        );
    }

    // If NOT logged in, show Login or Create Account.
    // These components handle their own full-width layout.
// 1. If NOT logged in, show Login or Create Account
    // 1. If NOT logged in, show the unified Login Page
    if (!currentUser) {
        return <LoginPage />;
    }
    // If Logged in, show the app with max-width and padding.
    return (
        <div className="bg-[#023e8a] text-white min-h-screen p-4 font-sans">
            <div className="max-w-4xl mx-auto text-center">

                {/* Header */}
                <header className="border-b border-gray-600 pb-4 mb-6 relative">
                    <button
                        onClick={handleLogout}
                        className="absolute top-0 right-0 bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                        Logout
                    </button>
                    <h1 className="text-4xl font-bold tracking-wider">Mathemix 🧮</h1>

                    {/* Only show stats in Solo Mode */}
                    {gameMode === 'solo' && (
                        <div className="flex justify-around text-lg mt-4">
                            <span>Streak: {currentStreak}</span>
                            <span>Longest Streak: {longestStreak}</span>
                        </div>
                    )}
                </header>

                {/* Content Area based on Game Mode */}
                {gameMode === "solo" ? (
                    selectedCategory ? (
                        <Game
                            category={selectedCategory}
                            onGameEnd={handleSoloGameEnd}
                            goBack={() => setSelectedCategory(null)}
                        />
                    ) : (
                        <div className="mt-10">
                            <button
                                onClick={() => setGameMode(null)}
                                className="bg-transparent text-blue-300 hover:text-blue-100 text-lg cursor-pointer float-left mb-2"
                            >
                                &larr; Back to Mode Select
                            </button>
                            <h2 className="text-2xl mb-6 clear-both">Select a Category</h2>
                            {Object.keys(QUESTIONS).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setCurrentStreak(0);
                                    }}
                                    className="block w-full p-5 text-lg mb-4 bg-blue-700 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )
                ) : gameMode === "multiplayer" ? (
                    <Lobby
                        goBack={() => setGameMode(null)}
                        user={currentUser}
                    />
                ) : (
                    <ModeSelect
                        username={username}
                        onSelectMode={(mode) => setGameMode(mode)}
                    />
                )}
            </div>
        </div>
    );
}

export default App;