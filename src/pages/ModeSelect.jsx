// src/pages/ModeSelect.jsx

import React from "react";
import { useNavigate } from "react-router-dom"; // <--- Import Hook

function ModeSelect({ username }) {
    const navigate = useNavigate(); // <--- Initialize Hook

    return (
        <div className="p-8 bg-[#0077b6] rounded-xl shadow-2xl max-w-md mx-auto mt-10">
            <h2 className="text-3xl font-bold mb-6 text-white">Hello, {username}!</h2>
            <p className="text-lg mb-8 text-[#E0E0E0]">Select a game mode to start.</p>

            <button
                onClick={() => navigate("/game")} // <--- Go to Solo Game Route
                className="block w-full p-5 text-xl mb-4 bg-[#023e8a] hover:bg-[#0353a4] text-white rounded-xl font-bold cursor-pointer transition-transform transform hover:scale-105 shadow-md"
            >
                Solo Mode 👤
            </button>

            <button
                onClick={() => navigate("/lobby")} // <--- Go to Multiplayer Lobby Route
                className="block w-full p-5 text-xl mb-4 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-xl font-bold cursor-pointer transition-transform transform hover:scale-105 shadow-md"
            >
                Multiplayer Mode 👥
            </button>
        </div>
    );
}

export default ModeSelect;