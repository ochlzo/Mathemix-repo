// src/CreateAccountPage.jsx

import React, { useState } from "react";
import { auth, db } from "./firebaseConfig.js"; // <-- Import Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function CreateAccountPage({ onShowLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateAccountSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            // 1. Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            // 2. Create a document in Firestore for this user
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                longestStreak: 0,
            });

            setMessage("Account created successfully! You can now log in.");
            // Clear form
            setUsername("");
            setEmail("");
            setPassword("");

            // Automatically switch to login screen
            setTimeout(() => {
                onShowLogin();
            }, 2000);

        } catch (firebaseError) {
            setError(firebaseError.message);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-120px)] rounded-xl overflow-hidden shadow-2xl mt-8">
            {/* Left Panel: Create Account Form */}
            <div className="md:w-1/2 bg-white text-gray-900 p-8 flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold mb-8">Create Account</h2>
                {/* ... (social buttons can stay) ... */}
                <p className="text-gray-500 mb-6">or use your email for registration:</p>

                <form onSubmit={handleCreateAccountSubmit} className="w-full max-w-sm">
                    {/* Username Input (NEW) */}
                    <div className="mb-4">
                        <label className="sr-only" htmlFor="create-username">
                            Username
                        </label>
                        <div className="relative">
                            {/* ... (icon) ... */}
                            <input
                                type="text"
                                id="create-username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="sr-only" htmlFor="create-email">
                            Email
                        </label>
                        <div className="relative">
                            {/* ... (icon) ... */}
                            <input
                                type="email"
                                id="create-email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label className="sr-only" htmlFor="create-password">
                            Password
                        </label>
                        <div className="relative">
                            {/* ... (icon) ... */}
                            <input
                                type="password"
                                id="create-password"
                                placeholder="Password (min. 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {message && <p className="text-green-600 mb-4">{message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-colors"
                    >
                        SIGN UP
                    </button>
                </form>
            </div>

            {/* Right Panel: Welcome Back! */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-8 flex flex-col justify-center items-center text-white text-center">
                {/* ... (content) ... */}
                <button
                    onClick={onShowLogin}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors"
                >
                    SIGN IN
                </button>
            </div>
        </div>
    );
}

export default CreateAccountPage;