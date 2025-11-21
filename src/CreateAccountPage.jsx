// src/CreateAccountPage.jsx

import React, { useState } from "react";
import { auth, db } from "./firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// IMPORT YOUR IMAGE HERE
import createAccImg from "./assets/createaccimg.jpg";

function CreateAccountPage({ onShowLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bMonth, setBMonth] = useState("");
    const [bDay, setBDay] = useState("");
    const [bYear, setBYear] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateAccountSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!username || !bMonth || !bDay || !bYear) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                birthday: `${bMonth}/${bDay}/${bYear}`,
                longestStreak: 0,
            });

            setMessage("Account created! Logging you in...");
        } catch (firebaseError) {
            setError(firebaseError.message);
        }
    };

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="flex min-h-screen w-full font-sans bg-white text-left">

            {/* --- LEFT SIDE: IMAGE --- */}
            <div className="hidden md:flex w-1/2 bg-[#023e8a] relative overflow-hidden">
                {/* The Image */}
                <img
                    src={createAccImg}
                    alt="Signup visual"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 h-full text-center">
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-[#FFD700]">
                        Mathemix
                    </h1>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">
                        The best way to master math. <br />
                        Smash sets in your sweats.
                    </h2>
                </div>
            </div>

            {/* --- RIGHT SIDE: SIGNUP FORM --- */}
            <div className="w-full md:w-1/2 bg-white flex flex-col p-8 md:p-16 overflow-y-auto">
                <div className="flex justify-end mb-12 gap-6 text-lg font-bold text-gray-500">
                    <button
                        className="text-black border-b-4 border-[#FFD700] pb-1 transition-colors"
                    >
                        Sign up
                    </button>
                    <button
                        onClick={onShowLogin}
                        className="hover:text-gray-800 pb-1 transition-colors"
                    >
                        Log In
                    </button>
                </div>

                <div className="max-w-md mx-auto w-full">
                    <h3 className="text-2xl font-bold mb-8 text-gray-800">
                        Sign up to start playing
                    </h3>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleCreateAccountSubmit} className="space-y-5">
                        {/* Birthday */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Birthday</label>
                            <div className="flex gap-2">
                                <select
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white text-black focus:border-[#0077b6] focus:outline-none"
                                    value={bMonth} onChange={(e) => setBMonth(e.target.value)} required
                                >
                                    <option value="" disabled>Month</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                                <select
                                    className="w-1/4 p-3 border-2 border-gray-200 rounded-lg bg-white text-black focus:border-[#0077b6] focus:outline-none"
                                    value={bDay} onChange={(e) => setBDay(e.target.value)} required
                                >
                                    <option value="" disabled>Day</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select
                                    className="w-1/3 p-3 border-2 border-gray-200 rounded-lg bg-white text-black focus:border-[#0077b6] focus:outline-none"
                                    value={bYear} onChange={(e) => setBYear(e.target.value)} required
                                >
                                    <option value="" disabled>Year</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0077b6] focus:outline-none transition-colors text-black"
                                required
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Username</label>
                            <input
                                type="text"
                                placeholder="andrew123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0077b6] focus:outline-none transition-colors text-black"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-[#0077b6] focus:outline-none transition-colors text-black"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 mt-4 bg-[#023e8a] hover:bg-[#0077b6] text-white font-bold rounded-lg text-lg transition-transform transform active:scale-95 shadow-md"
                        >
                            Sign up
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-200">
                        <span className="text-gray-600">Already have an account?</span>
                        <button
                            onClick={onShowLogin}
                            className="ml-2 text-[#023e8a] font-bold hover:underline"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateAccountPage;