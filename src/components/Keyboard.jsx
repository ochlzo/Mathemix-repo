// src/pages/Game.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import hook
import { QUESTIONS } from "../data.js"; // Go up one level
import Grid from "../components/Grid.jsx"; // In components folder
import Keyboard from "../components/Keyboard.jsx"; // In components folder

// ... (getRandomQuestion function) ...

function Game() {
    const navigate = useNavigate();
    // ... (Game Logic) ...

    return (
        <div className="w-full p-4 bg-blue-700 rounded-xl shadow-2xl relative">

            {/* Back Button uses navigate */}
            <button
                onClick={() => navigate("/mode-select")}
                className="bg-transparent text-yellow-400 hover:text-white text-lg cursor-pointer float-left mb-4 font-semibold"
            >
                &larr; Back to Menu
            </button>

            {/* ... Rest of your Game JSX ... */}
        </div>
    );
}
export default Game;