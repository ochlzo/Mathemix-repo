// src/Keyboard.jsx

import React from "react";

function Keyboard({ onKey, onClear, onDelete, onSubmit, onGiveUp }) {
    const baseKeyClass =
        "font-bold h-14 rounded-md text-white cursor-pointer flex justify-center items-center uppercase transition-colors";

    return (
        <div className="space-y-2 mt-8">
            {/* Number Row */}
            <div className="flex justify-center gap-1.5">
                {"1234567890()".split("").map((key) => (
                    <button
                        key={key}
                        onClick={() => onKey(key)}
                        className={`${baseKeyClass} flex-1 bg-blue-700 hover:bg-blue-600 text-base`}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* QWERTY Row */}
            <div className="flex justify-center gap-1.5">
                {"QWERTYUIOP".split("").map((key) => (
                    <button
                        key={key}
                        onClick={() => onKey(key)}
                        className={`${baseKeyClass} flex-1 bg-blue-700 hover:bg-blue-600 text-base`}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {/* ASDF Row */}
            <div className="flex justify-center gap-1.5">
                <div className="flex-[0.5]"></div> {/* Spacer */}
                {"ASDFGHJKL".split("").map((key) => (
                    <button
                        key={key}
                        onClick={() => onKey(key)}
                        className={`${baseKeyClass} flex-1 bg-blue-700 hover:bg-blue-600 text-base`}
                    >
                        {key}
                    </button>
                ))}
                <div className="flex-[0.5]"></div> {/* Spacer */}
            </div>

            {/* ZXC Row + Clear/Del */}
            <div className="flex justify-center gap-1.5">
                <button
                    onClick={onClear}
                    className={`${baseKeyClass} flex-[1.5] bg-gray-600 hover:bg-gray-500 text-sm`}
                >
                    Clear
                </button>
                {"ZXCVBNM".split("").map((key) => (
                    <button
                        key={key}
                        onClick={() => onKey(key)}
                        className={`${baseKeyClass} flex-1 bg-blue-700 hover:bg-blue-600 text-base`}
                    >
                        {key}
                    </button>
                ))}
                <button
                    onClick={onDelete}
                    className={`${baseKeyClass} flex-[1.5] bg-gray-600 hover:bg-gray-500 text-sm`}
                >
                    DEL
                </button>
            </div>

            {/* --- BOTTOM ROW (UPDATED) --- */}
            {/* No more "SPACE" button */}
            <div className="flex justify-center gap-1.5 pt-2">
                <button
                    onClick={onSubmit}
                    className={`${baseKeyClass} ${onGiveUp ? 'flex-[3]' : 'flex-1'} bg-green-600 hover:bg-green-500 text-sm`}
                >
                    Submit
                </button>

                {/* Only show "Give Up" if the 'onGiveUp' prop is passed */}
                {onGiveUp && (
                    <button
                        onClick={onGiveUp}
                        className={`${baseKeyClass} flex-[2] bg-red-700 hover:bg-red-600 text-sm`}
                    >
                        Give Up
                    </button>
                )}
            </div>
        </div>
    );
}

export default Keyboard;