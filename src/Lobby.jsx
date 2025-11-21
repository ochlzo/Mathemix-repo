// src/Lobby.jsx

import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig.js";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import MultiplayerGame from "./MultiplayerGame.jsx";
import { QUESTIONS } from "./data.js";

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
            category: "Number & Algebra",
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

        const category = roomData.category;
        const question = QUESTIONS[category][Math.floor(Math.random() * QUESTIONS[category].length)];

        const roomRef = doc(db, "rooms", roomCode);
        await updateDoc(roomRef, {
            status: "playing",
            currentQuestion: question,
            roundStartTime: Date.now(),
            answers: [],
        });
    };

    const handleCategoryChange = async (newCategory) => {
        if (!isHost || !roomCode) return;
        const roomRef = doc(db, "rooms", roomCode);
        await updateDoc(roomRef, {
            category: newCategory
        });
    };

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
            <div className="p-4 bg-mediumBlue rounded-xl shadow-2xl"> {/* New background, rounded corners, shadow */}
                <h2 className="text-3xl font-bold mb-4 text-center text-white">Host Lobby</h2>
                <div className="bg-lightBlue p-6 rounded-xl mb-6 shadow-md"> {/* New background, rounded, shadow */}
                    <p className="text-lg mb-2 text-primaryText">Share this code with your friends:</p>
                    <h3 className="text-5xl font-bold tracking-widest bg-darkBlue p-4 rounded-lg text-center text-highlightYellow"> {/* Darker background, highlight yellow */}
                        {roomCode}
                    </h3>
                </div>

                <h3 className="text-xl mb-2 text-primaryText">Players Waiting ({roomData?.players.length || 0}):</h3>
                <ul className="list-disc list-inside bg-lightBlue p-4 rounded-lg mb-6 min-h-[100px] shadow-sm"> {/* New background, rounded */}
                    {roomData?.players.map((p) => (
                        <li key={p.uid} className="text-primaryText">
                            {p.nickname} {p.uid === user.uid && "⭐ (You)"}
                        </li>
                    ))}
                </ul>

                <h3 className="text-xl mb-2 text-primaryText">Select Category:</h3>
                <select
                    value={roomData?.category || "Number & Algebra"}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 rounded-lg text-gray-900 mb-6 text-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-lighterBlue"
                >
                    {Object.keys(QUESTIONS).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <button
                    onClick={handleStartGame}
                    className="w-full py-4 bg-correctGreen hover:bg-green-500 rounded-lg text-xl font-bold text-white transition-transform transform hover:scale-105 shadow-md"
                >
                    Start Game
                </button>
            </div>
        );
    }

    // RENDER: Joiner Lobby View
    if (view === "waiting") {
        return (
            <div className="p-4 bg-mediumBlue rounded-xl shadow-2xl"> {/* New background, rounded corners, shadow */}
                <h2 className="text-3xl font-bold mb-4 text-center text-white">Joined Room: {roomCode}</h2>
                <h3 className="text-xl mb-2 text-primaryText">Players in Lobby ({roomData?.players.length || 0}):</h3>
                <ul className="list-disc list-inside bg-lightBlue p-4 rounded-lg mb-6 min-h-[100px] shadow-sm"> {/* New background, rounded */}
                    {roomData?.players.map((p) => (
                        <li key={p.uid} className="text-primaryText">
                            {p.nickname}
                            {p.uid === roomData.hostId && " (Host) ⭐"}
                            {p.uid === user.uid && " (You)"}
                        </li>
                    ))}
                </ul>
                <p className="text-2xl animate-pulse text-white text-center">Waiting for the host to start the game...</p>
            </div>
        );
    }

    // RENDER: Default Select View (Host or Join)
    return (
        <div className="p-4 bg-mediumBlue rounded-xl shadow-2xl"> {/* New background, rounded corners, shadow */}
            <button onClick={goBack} className="bg-transparent text-highlightYellow hover:text-white text-lg cursor-pointer float-left mb-4 font-semibold">
                &larr; Back to Mode Select
            </button>

            {error && (
                <p className="bg-wrongRed p-3 rounded-lg text-lg clear-both text-white">{error}</p>
            )}

            <div className="my-6 clear-both">
                <label htmlFor="nickname" className="text-xl block mb-2 text-white">Enter Your Nickname</label>
                <input
                    id="nickname"
                    type="text"
                    placeholder="e.g., MathWiz"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full p-3 rounded-lg text-gray-900 text-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-lighterBlue"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-8">
                {/* Host Game Box */}
                <div className="flex-1 bg-lightBlue p-6 rounded-xl shadow-md"> {/* New background, rounded, shadow */}
                    <h2 className="text-2xl mb-4 text-white">Host a Game</h2>
                    <p className="mb-6 text-primaryText">Create a new room and get a code to share with friends.</p>
                    <button
                        onClick={handleHostGame}
                        className="w-full py-4 bg-lighterBlue hover:bg-white hover:text-darkBlue rounded-lg text-xl font-bold text-white transition-transform transform hover:scale-105 shadow-md"
                    >
                        Create Room
                    </button>
                </div>

                {/* Join Game Box */}
                <div className="flex-1 bg-lightBlue p-6 rounded-xl shadow-md"> {/* New background, rounded, shadow */}
                    <h2 className="text-2xl mb-4 text-white">Join a Game</h2>
                    <label htmlFor="roomCode" className="block mb-2 text-primaryText">Enter Room Code:</label>
                    <input
                        id="roomCode"
                        type="text"
                        placeholder="ABC12"
                        value={joinInput}
                        onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                        className="w-full p-3 rounded-lg text-gray-900 text-lg uppercase bg-gray-200 focus:outline-none focus:ring-2 focus:ring-lighterBlue"
                        maxLength={5}
                    />
                    <button
                        onClick={handleJoinGame}
                        className="w-full py-4 mt-6 bg-correctGreen hover:bg-green-500 rounded-lg text-xl font-bold text-white transition-transform transform hover:scale-105 shadow-md"
                    >
                        Join Room
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Lobby;