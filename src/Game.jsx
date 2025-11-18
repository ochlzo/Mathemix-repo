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

    // --- UPDATED LOGIC ---
    const answer = question.answer.toUpperCase();
    // Create a "pure" answer with only guessable chars
    const pureAnswer = answer.replace(/[^A-Z0-9]/g, '');
    const numGuessableBoxes = pureAnswer.length;

    const handleKey = (key) => {
        if (status !== "playing") return;
        // Check against the number of *boxes*, not the full answer length
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
        // Check against the number of *boxes*
        if (status !== "playing" || guess.length !== numGuessableBoxes) return;

        // Compare the pure guess to the pure answer
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
                e.preventDefault(); // <-- Stop spacebar from doing anything
            } else if (key.match(/^[A-Z0-9()]$/)) {
                handleKey(key);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [guess, status]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="w-full">
            <button onClick={goBack} className="bg-transparent text-blue-300 hover:text-blue-100 text-lg cursor-pointer float-left mb-2">
                &larr; Change Category
            </button>

            <div className="bg-blue-800 border border-blue-600 rounded-lg p-6 my-6 text-xl min-h-[100px] flex items-center justify-center clear-both">
                <p>{question.definition}</p>
            </div>

            {/* Grid now receives the pure guess and full answer */}
            <Grid guess={guess} answer={answer} status={status} />

            {/* ... (end game message) ... */}

            {status === "playing" && (
                <Keyboard
                    onKey={handleKey}
                    onClear={handleClear}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                    onGiveUp={handleGiveUp} // Give Up is passed for solo
                />
            )}
        </div>
    );
}

export default Game;