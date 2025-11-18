// src/ModeSelect.jsx

import React from "react";

function ModeSelect({ onSelectMode, username }) {
    return (
        <div className="mt-10">
            <h2 className="text-2xl mb-6">Hello, {username}!</h2>
            <p className="text-lg mb-8">Select a game mode to start.</p>

            <button
                onClick={() => onSelectMode("solo")}
                className="block w-full p-5 text-lg mb-4 bg-blue-700 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors"
            >
                Solo Mode
            </button>

            <button
                onClick={() => onSelectMode("multiplayer")}
                className="block w-full p-5 text-lg mb-4 bg-green-700 hover:bg-green-600 rounded-lg cursor-pointer transition-colors"
            >
                Multiplayer Mode
            </button>
        </div>
    );
}

export default ModeSelect;