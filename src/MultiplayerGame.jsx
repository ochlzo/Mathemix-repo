// src/MultiplayerGame.jsx

import React, { useState, useEffect, useCallback } from "react"; // <--- TYPO REMOVED
import { db } from "./firebaseConfig.js";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import Grid from "./Grid.jsx";
import Keyboard from "./Keyboard.jsx";
import { QUESTIONS } from "./data.js";

function MultiplayerGame({ roomCode, roomData, user }) {
    const [guess, setGuess] = useState("");
    const [status, setStatus] = useState("playing");
    const [scoreMessage, setScoreMessage] = useState("");
    const [nextCategory, setNextCategory] = useState(roomData.category);

    const {
        currentQuestion,
        players,
        hostId,
        answers = [],
        roundStartTime,
    } = roomData;

    // Define pure answer properties
    const answer = currentQuestion.answer.toUpperCase();
    const pureAnswer = answer.replace(/[^A-Z0-9]/g, '');
    const numGuessableBoxes = pureAnswer.length;

    const isHost = hostId === user.uid;
    const hasAnswered = answers.some(a => a.uid === user.uid);

    useEffect(() => {
        setGuess("");
        setStatus("playing");
        setScoreMessage("");
    }, [currentQuestion]);

    const handleKey = (key) => {
        // Use the new box count
        if (status !== "playing" || hasAnswered || guess.length >= numGuessableBoxes) return;
        setGuess(guess + key);
    };
    const handleClear = () => setGuess("");
    const handleDelete = () => setGuess(guess.slice(0, -1));

    const handleSubmit = async () => {
        // Use the new box count
        if (status !== "playing" || hasAnswered || guess.length !== numGuessableBoxes) return;

        let score = 0;
        let isCorrect = false;

        // Compare pure guess to pure answer
        if (guess.trim().toUpperCase() === pureAnswer) {
            isCorrect = true;
            const timeTaken = (Date.now() - roundStartTime) / 1000;
            score = Math.max(10, 100 - Math.floor(timeTaken * 2));
            setStatus("correct");
            setScoreMessage(`+${score} points!`);
        } else {
            setStatus("wrong");
            setScoreMessage("Wrong answer!");
        }

        const roomRef = doc(db, "rooms", roomCode);
        const answerData = {
            uid: user.uid,
            nickname: user.username,
            guess: guess.toUpperCase(),
            isCorrect,
            score,
        };

        await updateDoc(roomRef, {
            answers: arrayUnion(answerData)
        });
    };

    const handleNextRound = async () => {
        if (!isHost) return;

        const category = nextCategory;
        const question = QUESTIONS[category][Math.floor(Math.random() * QUESTIONS[category].length)];
        const roomRef = doc(db, "rooms", roomCode);

        const updatedPlayers = players.map(p => {
            const answer = answers.find(a => a.uid === p.uid);
            if (answer && answer.isCorrect) {
                return { ...p, score: p.score + answer.score };
            }
            return p;
        });

        await updateDoc(roomRef, {
            status: "playing",
            currentQuestion: question,
            roundStartTime: Date.now(),
            answers: [],
            players: updatedPlayers,
            category: category
        });
    };

    const handleKeyDown = useCallback(
        (e) => {
            const key = e.key.toUpperCase();
            if (key === "ENTER") handleSubmit();
            else if (key === "BACKSPACE") handleDelete();
            else if (key === " ") { e.preventDefault(); } // Stop spacebar
            else if (key.match(/^[A-Z0-9()]$/)) handleKey(key);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [guess, status, hasAnswered]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const allPlayersAnswered = players.length === answers.length;
    // Use the full answer string for reveal
    const revealedAnswer = allPlayersAnswered ? answer : null;
    const answerMask = answer.replace(/[A-Z0-9]/g, '_');

    return (
        <div className="w-full flex flex-col md:flex-row gap-6">
            {/* Left Side: Game */}
            <div className="w-full md:w-2/3">
                <div className="bg-blue-800 border border-blue-600 rounded-lg p-6 my-6 text-xl min-h-[100px] flex items-center justify-center">
                    <p>{currentQuestion.definition}</p>
                </div>

                {allPlayersAnswered && (
                    <div className="my-4 p-4 bg-blue-600 rounded-lg">
                        <p className="text-xl">The answer was: **{revealedAnswer}**</p>
                        {isHost && (
                            <div className="mt-4">
                                <label className="block text-lg mb-2">Category for Next Round:</label>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={nextCategory}
                                        onChange={(e) => setNextCategory(e.target.value)}
                                        className="p-2 rounded-lg text-gray-900 text-lg"
                                    >
                                        {Object.keys(QUESTIONS).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <button onClick={handleNextRound} className="p-2 px-4 text-lg bg-green-500 hover:bg-green-400 text-blue-900 font-bold rounded-lg cursor-pointer">
                                        Next Round
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {status !== 'playing' && !allPlayersAnswered && (
                    <div className={`my-4 p-4 rounded-lg ${status === 'correct' ? 'bg-green-600' : 'bg-red-600'}`}>
                        <p className="text-xl">{scoreMessage}</p>
                    </div>
                )}

                {hasAnswered && !allPlayersAnswered && (
                    <p className="text-xl animate-pulse">Waiting for other players...</p>
                )}

                <Grid
                    guess={guess}
                    answer={revealedAnswer || answerMask}
                    status={revealedAnswer ? "reveal" : "playing"}
                />

                <Keyboard
                    onKey={handleKey}
                    onClear={handleClear}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                    onGiveUp={null} // Pass null so the button doesn't render
                />
            </div>

            {/* Right Side: Leaderboard */}
            <div className="w-full md:w-1/3 p-4 bg-blue-800 rounded-lg mt-6">
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">Leaderboard</h2>
                <ul className="space-y-2">
                    {players.sort((a, b) => b.score - a.score).map((p, index) => (
                        <li key={p.uid} className="flex justify-between text-lg p-2 rounded bg-blue-700">
                            <span>{index + 1}. {p.nickname} {p.uid === user.uid && "(You)"}</span>
                            <span className="font-bold">{p.score}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MultiplayerGame;