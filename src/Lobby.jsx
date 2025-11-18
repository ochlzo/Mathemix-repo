// src/Lobby.jsx

import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig.js";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import MultiplayerGame from "./MultiplayerGame.jsx";
import { QUESTIONS } from "./data.js";

// Helper function to generate a room code
const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
};

function Lobby({ goBack, user }) {
    const [view, setView] = useState("select");
    const [nickname, setNickname] = useState(user.username || "Player");
    const [roomCode, setRoomCode] = useState("");
    const [joinInput, setJoinInput] = useState("");
    const [error, setError] = useState("");
    const [roomData, setRoomData] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const isHost = roomData?.hostId === user.uid;

    // Real-time listener for the room
    useEffect(() => {
        if (!roomCode) return;

        const roomRef = doc(db, "rooms", roomCode);
        const unsubscribe = onSnapshot(roomRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setRoomData(data);
                if (data.status === "playing") {
                    setGameStarted(true);
                }
            } else {
                if (view === "host" || view === "waiting") {
                    setError("Room not found or has been closed.");
                    setRoomCode("");
                    setRoomData(null);
                    setView("select");
                }
            }
        });

        return () => unsubscribe();

    }, [roomCode, view]);


    // --- Button Handlers ---

    const handleHostGame = async () => {
        if (!nickname) {
            setError("Please enter a nickname.");
            return;
        }
        setError("");

        const newRoomCode = generateRoomCode();
        setRoomCode(newRoomCode);
        setView("host");

        const roomRef = doc(db, "rooms", newRoomCode);
        const newPlayer = { uid: user.uid, nickname, score: 0 };

        await setDoc(roomRef, {
            hostId: user.uid,
            hostName: nickname,
            roomCode: newRoomCode,
            players: [newPlayer],
            category: "Number & Algebra", // Default category
            status: "waiting",
            currentQuestion: null,
            answers: [],
        });
    };

    const handleJoinGame = async () => {
        if (!nickname || !joinInput) {
            setError("Please enter a nickname and room code.");
            return;
        }
        setError("");

        const codeToJoin = joinInput.toUpperCase();
        const roomRef = doc(db, "rooms", codeToJoin);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            setError("Room not found. Check the code and try again.");
            return;
        }

        const data = roomSnap.data();
        if (data.status === "playing") {
            setError("Game is already in progress. Cannot join.");
            return;
        }

        const newPlayer = { uid: user.uid, nickname, score: 0 };
        await updateDoc(roomRef, {
            players: arrayUnion(newPlayer)
        });

        setRoomCode(codeToJoin);
        setView("waiting");
    };

    const handleStartGame = async () => {
        if (!roomData) return;

        const category = roomData.category; // Reads the category from Firestore

        // --- UPDATED LOGIC ---
        // Get the actual question object from the data file
        const question = QUESTIONS[category][Math.floor(Math.random() * QUESTIONS[category].length)];

        const roomRef = doc(db, "rooms", roomCode);
        await updateDoc(roomRef, {
            status: "playing",
            currentQuestion: question, // Save the full question object
            roundStartTime: Date.now(),
            answers: [],
        });
    };



    // NEW: Handler for when host changes the category
    const handleCategoryChange = async (newCategory) => {
        if (!isHost || !roomCode) return;
        const roomRef = doc(db, "rooms", roomCode);
        await updateDoc(roomRef, {
            category: newCategory
        });
    };

    // --- Render Logic ---

    if (gameStarted && roomData) {
        return (
            <MultiplayerGame
                roomCode={roomCode}
                roomData={roomData}
                user={user}
            />
        );
    }

    // RENDER: Host Lobby View
    if (view === "host") {
        return (
            <div className="text-white">
                <h2 className="text-2xl mb-4">Host Lobby</h2>
                <div className="bg-blue-800 p-6 rounded-lg mb-6">
                    <p className="text-lg mb-2">Share this code with your friends:</p>
                    <h3 className="text-5xl font-bold tracking-widest bg-gray-900 p-4 rounded-lg text-center">
                        {roomCode}
                    </h3>
                </div>

                <h3 className="text-xl mb-2">Players Waiting ({roomData?.players.length || 0}):</h3>
                <ul className="list-disc list-inside bg-blue-800 p-4 rounded-lg mb-6 min-h-[100px]">
                    {roomData?.players.map((p) => (
                        <li key={p.uid}>
                            {p.nickname} {p.uid === user.uid && "⭐ (You)"}
                        </li>
                    ))}
                </ul>

                {/* --- THIS IS THE NEW DROPDOWN --- */}
                <h3 className="text-xl mb-2">Select Category:</h3>
                <select
                    value={roomData?.category || "Number & Algebra"}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 rounded-lg text-gray-900 mb-6 text-lg"
                >
                    {Object.keys(QUESTIONS).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button
                    onClick={handleStartGame}
                    className="w-full p-4 bg-green-600 rounded-lg font-bold text-xl"
                >
                    Start Game
                </button>
            </div>
        );
    }

    // RENDER: Joiner Lobby View
    if (view === "waiting") {
        return (
            <div className="text-white">
                <h2 className="text-2xl mb-4">Joined Room: {roomCode}</h2>
                <h3 className="text-xl mb-2">Players in Lobby ({roomData?.players.length || 0}):</h3>
                <ul className="list-disc list-inside bg-blue-800 p-4 rounded-lg mb-6 min-h-[100px]">
                    {roomData?.players.map((p) => (
                        <li key={p.uid}>
                            {p.nickname}
                            {p.uid === roomData.hostId && " (Host) ⭐"}
                            {p.uid === user.uid && " (You)"}
                        </li>
                    ))}
                </ul>
                <p className="text-2xl animate-pulse">Waiting for the host to start the game...</p>
            </div>
        );
    }

    // RENDER: Default Select View (Host or Join)
    return (
        <div className="text-white">
            <button onClick={goBack} className="bg-transparent text-blue-300 hover:text-blue-100 text-lg cursor-pointer float-left mb-2">
                &larr; Back to Mode Select
            </button>

            {error && (
                <p className="bg-red-600 p-3 rounded-lg text-lg clear-both">{error}</p>
            )}

            {/* Shared Nickname Input */}
            <div className="my-6 clear-both">
                <label htmlFor="nickname" className="text-xl block mb-2">Enter Your Nickname</label>
                <input
                    id="nickname"
                    type="text"
                    placeholder="e.g., MathWiz"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-3 rounded-lg text-gray-900 text-lg"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Host Game Box */}
                <div className="flex-1 bg-blue-800 p-6 rounded-lg">
                    <h2 className="text-2xl mb-4">Host a Game</h2>
                    <p className="mb-4">Create a new room and get a code to share with friends.</p>
                    <button
                        onClick={handleHostGame}
                        className="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-lg"
                    >
                        Create Room
                    </button>
                </div>

                {/* Join Game Box */}
                <div className="flex-1 bg-blue-800 p-6 rounded-lg">
                    <h2 className="text-2xl mb-4">Join a Game</h2>
                    <label htmlFor="roomCode" className="block mb-2">Enter Room Code:</label>
                    <input
                        id="roomCode"
                        type="text"
                        placeholder="ABC12"
                        value={joinInput}
                        onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                        className="w-full p-3 rounded-lg text-gray-900 text-lg uppercase"
                        maxLength={5}
                    />
                    <button
                        onClick={handleJoinGame}
                        className="w-full p-4 mt-4 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-lg"
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Lobby;