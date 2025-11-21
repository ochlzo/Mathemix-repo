// src/Game.jsx

import React, { useState, useEffect, useCallback } from "react";
import { QUESTIONS } from "./data.js";
import Grid from "./Grid.jsx";
import Keyboard from "./Keyboard.jsx";

const getRandomQuestion = (category) => {
    const questions = QUESTIONS[category];
    return questions[Math.floor(Math.random() * questions.length)];
};

function Game({ category, onGameEnd, goBack }) {
    const [question, setQuestion] = useState(getRandomQuestion(category));
    const [guess, setGuess] = useState("");
    const [status, setStatus] = useState("playing");

    const answer = question.answer.toUpperCase();
    const pureAnswer = answer.replace(/[^A-Z0-9]/g, '');
    const numGuessableBoxes = pureAnswer.length;

    const handleKey = (key) => {
        if (status !== "playing") return;
        if (guess.length < numGuessableBoxes) {
            setGuess(guess + key);
        }
    };

    const handleClear = () => {
        if (status !== "playing") return;
        setGuess("");
    };

    const handleDelete = () => {
        if (status !== "playing") return;
        setGuess(guess.slice(0, -1));
    };

    const handleSubmit = () => {
        if (status !== "playing" || guess.length !== numGuessableBoxes) return;

        if (guess === pureAnswer) {
            setStatus("won");
            onGameEnd(true);
        } else {
            setStatus("lost");
            onGameEnd(false);
        }
    };

    const handleGiveUp = () => {
        if (status !== "playing") return;
        setStatus("reveal");
        onGameEnd(false);
    };

    const handleNext = () => {
        setQuestion(getRandomQuestion(category));
        setGuess("");
        setStatus("playing");
    };

    const handleKeyDown = useCallback(
        (e) => {
            const key = e.key.toUpperCase();
            if (key === "ENTER") {
                if (status === "playing") handleSubmit();
                else handleNext();
            } else if (key === "BACKSPACE") {
                handleDelete();
            } else if (key === " ") {
                e.preventDefault();
            } else if (key.match(/^[A-Z0-9()]$/)) {
                handleKey(key);
            }
        },
        [guess, status]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="w-full p-4 bg-blue-700 rounded-xl shadow-2xl relative">
            <button onClick={goBack} className="bg-transparent text-yellow-400 hover:text-white text-lg cursor-pointer float-left mb-4 font-semibold">
                &larr; Change Category
            </button>

            <div className="bg-blue-500 border border-blue-400 rounded-xl p-6 my-6 text-xl min-h-[100px] flex items-center justify-center clear-both shadow-md">
                <p className="text-white">{question.definition}</p>
            </div>

            <Grid guess={guess} answer={answer} status={status} />

            {/* --- NEW: POP-UP MODAL FOR RESULTS --- */}
            {status !== "playing" && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className={`p-8 rounded-2xl shadow-2xl border-4 border-white text-center max-w-sm w-full transform scale-110 ${status === "won" ? "bg-green-600" : "bg-red-600"}`}>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            {status === "won" ? "Correct! 🎉" : "Game Over"}
                        </h2>

                        {/* Show answer if lost or gave up */}
                        {(status === "reveal" || status === "lost") && (
                            <div className="mb-6 p-2 bg-white bg-opacity-20 rounded-lg">
                                <p className="text-white text-sm uppercase">The answer was:</p>
                                <p className="text-2xl font-bold text-white tracking-widest">{answer}</p>
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-white text-gray-900 rounded-xl text-xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            Next Question &rarr;
                        </button>
                    </div>
                </div>
            )}
            {/* ------------------------------------- */}

            {/* Only show keyboard if playing */}
            {status === "playing" && (
                <Keyboard
                    onKey={handleKey}
                    onClear={handleClear}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                    onGiveUp={handleGiveUp}
                />
            )}
        </div>
    );
}

export default Game;