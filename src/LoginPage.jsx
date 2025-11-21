// src/LoginPage.jsx

import React, { useState } from "react";
import { auth, db } from "./firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

import { motion, AnimatePresence } from "framer-motion";
import createAccImg from "./assets/createaccimg.jpg";

function LoginPage() {
    const [isRegister, setIsRegister] = useState(true);

    // Form States
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bMonth, setBMonth] = useState("");
    const [bDay, setBDay] = useState("");
    const [bYear, setBYear] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Helpers
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (isRegister) {
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
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (firebaseError) {
                console.error(firebaseError);
                setError("Invalid email or password.");
            }
        }
    };

    // --- STYLES ---
    const inputClass = "w-full p-3.5 bg-[#f6f7fb] border-2 border-[#f6f7fb] rounded-lg focus:bg-white focus:border-gray-300 outline-none transition-all text-gray-900 font-bold placeholder-gray-400 text-[15px]";
    const selectClass = "p-3.5 bg-white border-2 border-gray-200 rounded-lg focus:border-gray-400 outline-none text-gray-900 font-bold text-[15px] cursor-pointer transition-all";
    const labelClass = "block text-xs font-extrabold text-gray-600 uppercase mb-2 tracking-wide";

    const tabBaseClass = "text-2xl font-bold pb-1 mr-8 transition-colors cursor-pointer relative";
    const activeTabClass = "text-gray-900 border-b-[4px] border-gray-900";
    const inactiveTabClass = "text-gray-400 hover:text-gray-600 border-b-[4px] border-transparent";

    return (
        <div className="flex h-screen w-full font-nunito bg-white overflow-hidden">

            {/* --- LEFT SIDE: IMAGE CONTAINER --- */}
            <div className="hidden md:block w-1/2 h-full relative bg-[#ffe8b5]">
                <img
                    src={createAccImg}
                    alt="Visual"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ boxShadow: 'inset -40px 0 40px -15px rgba(0,0,0,0.3)' }}
                />

                {/* FIX: Removed Text Overlay */}
                {/* <div className="absolute inset-0 flex flex-col justify-center items-start p-16 z-10">
          <h1 className="text-6xl font-extrabold mb-6 text-[#FFD700] drop-shadow-lg">Mathemix</h1>
          <h2 className="text-4xl font-bold leading-tight text-white drop-shadow-md">
            The best way to study.<br/>
            Sign up for free.
          </h2>
        </div> */}
            </div>

            {/* --- RIGHT SIDE: FORM --- */}
            <div className="w-full md:w-1/2 h-full bg-white flex flex-col pt-20 px-8 md:px-16 overflow-y-auto shadow-xl">

                {/* Form Wrapper */}
                <div className="w-full max-w-[480px] mx-auto">

                    {/* Tabs */}
                    <div className="flex mb-8">
                        <button
                            onClick={() => setIsRegister(true)}
                            className={`${tabBaseClass} ${isRegister ? activeTabClass : inactiveTabClass}`}
                        >
                            Sign up
                        </button>
                        <button
                            onClick={() => setIsRegister(false)}
                            className={`${tabBaseClass} ${!isRegister ? activeTabClass : inactiveTabClass}`}
                        >
                            Log In
                        </button>
                    </div>

                    {/* Messages */}
                    {error && <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm font-bold rounded-md">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm font-bold rounded-md">{message}</div>}

                    <form onSubmit={handleAuth} className="w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isRegister ? "signup" : "login"}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >

                                {/* --- SIGN UP FIELDS --- */}
                                {isRegister && (
                                    <>
                                        <div>
                                            <label className={labelClass}>Birthday</label>
                                            <div className="flex gap-3">
                                                <select className={`${selectClass} flex-1`} value={bMonth} onChange={(e) => setBMonth(e.target.value)} required>
                                                    <option value="" disabled>Month</option>
                                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                                <select className={`${selectClass} w-[85px]`} value={bDay} onChange={(e) => setBDay(e.target.value)} required>
                                                    <option value="" disabled>Day</option>
                                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                                <select className={`${selectClass} w-[100px]`} value={bYear} onChange={(e) => setBYear(e.target.value)} required>
                                                    <option value="" disabled>Year</option>
                                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* --- SHARED FIELDS --- */}

                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        placeholder="user@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                {isRegister && (
                                    <div>
                                        <label className={labelClass}>Username</label>
                                        <input
                                            type="text"
                                            placeholder="andrew123"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                )}

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className={`${labelClass} mb-0`}>Password</label>
                                        {!isRegister && <button type="button" className="text-xs font-bold text-[#023e8a] hover:underline">Forgot password</button>}
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass}
                                        required
                                    />
                                </div>

                                {/* Policy Text (Signup Only) */}
                                {isRegister && (
                                    <div className="text-xs text-gray-500 font-medium leading-tight mt-1">
                                        By clicking Sign up, you accept Mathemix's <span className="text-[#023e8a] cursor-pointer hover:underline">Terms</span> and <span className="text-[#023e8a] cursor-pointer hover:underline">Privacy Policy</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#023e8a] hover:bg-[#0077b6] text-white font-extrabold rounded-lg text-lg transition-transform transform active:scale-95 shadow-sm mt-4"
                                >
                                    {isRegister ? "Sign up" : "Log in"}
                                </button>

                            </motion.div>
                        </AnimatePresence>
                    </form>

                    {/* Bottom Toggle Link */}
                    <div className="mt-8">
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="w-full py-4 bg-[#f6f7fb] hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-lg border-2 border-[#f6f7fb] transition-colors"
                        >
                            {isRegister ? "Already have an account? Log in" : "New to Mathemix? Create an account"}
                        </button>

                        {!isRegister && (
                            <div className="mt-4 text-center">
                                <button className="text-[#023e8a] font-bold text-sm hover:underline">
                                    Log in with magic link
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default LoginPage;