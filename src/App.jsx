// src/App.jsx

import React, { useState, useEffect } from "react";
import SoloGame from "./Game.jsx"; // Renamed for clarity
import Lobby from "./Lobby.jsx"; // NEW
import ModeSelect from "./ModeSelect.jsx"; // NEW
import { QUESTIONS } from "./data.js";
import LoginPage from "./LoginPage.jsx";
import CreateAccountPage from "./CreateAccountPage.jsx";
import { auth, db } from "./firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

function App() {
    // Solo Game State
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // App State
    const [gameMode, setGameMode] = useState(null); // 'solo', 'multiplayer'

    // Auth State
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    // Auth listener
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
                setGameMode(null); // Reset game mode on logout
                setSelectedCategory(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Solo game end handler
    const handleGameEnd = async (didWin) => {
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

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setCurrentStreak(0);
    };

    const handleLogout = () => {
        signOut(auth);
    };

    const categories = Object.keys(QUESTIONS);

    // --- Render Logic ---

    if (loading) {
        return (
            <div className="bg-blue-900 text-white min-h-screen p-4 font-sans math-background flex justify-center items-center">
                <h2 className="text-2xl">Loading Mathemix...</h2>
            </div>
        );
    }

    const renderContent = () => {
        if (!currentUser) {
            // 1. Auth Forms
            return showCreateAccount ? (
                <CreateAccountPage onShowLogin={() => setShowCreateAccount(false)} />
            ) : (
                <LoginPage onShowCreateAccount={() => setShowCreateAccount(true)} />
            );
        }

        if (gameMode === "solo") {
            // 2. Solo Mode
            if (selectedCategory) {
                return (
                    <SoloGame
                        category={selectedCategory}
                        onGameEnd={handleGameEnd}
                        goBack={() => setSelectedCategory(null)}
                    />
                );
            }
            return (
                <div className="mt-10">
                    <button onClick={() => setGameMode(null)} className="bg-transparent text-blue-300 hover:text-blue-100 text-lg cursor-pointer float-left mb-2">
                        &larr; Back to Mode Select
                    </button>
                    <h2 className="text-2xl mb-6 clear-both">Select a Category</h2>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleSelectCategory(cat)}
                            className="block w-full p-5 text-lg mb-4 bg-blue-700 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            );
        }

        if (gameMode === "multiplayer") {
            // 3. Multiplayer Mode
            // NEW LINE:
            return <Lobby goBack={() => setGameMode(null)} user={currentUser} />;
        }

        // 4. Default: Mode Select
        return (
            <ModeSelect
                username={username}
                onSelectMode={(mode) => setGameMode(mode)}
            />
        );
    }

    return (
        <div className="bg-blue-900 text-white min-h-screen p-4 font-sans math-background">
            <div className="max-w-4xl mx-auto text-center"> {/* Widened for multiplayer */}
                <header className="border-b border-gray-600 pb-4 mb-6 relative">
                    {currentUser && (
                        <button
                            onClick={handleLogout}
                            className="absolute top-0 right-0 bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                            Logout
                        </button>
                    )}
                    <h1 className="text-4xl font-bold tracking-wider">Mathemix 🧮</h1>
                    {currentUser && gameMode === 'solo' && (
                        <div className="flex justify-around text-lg mt-4">
                            <span>Streak: {currentStreak}</span>
                            <span>Longest Streak: {longestStreak}</span>
                        </div>
                    )}
                </header>
                {renderContent()}
            </div>
        </div>
    );
}

export default App;