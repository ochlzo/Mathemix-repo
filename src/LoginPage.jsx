// src/LoginPage.jsx

import React, { useState } from "react";
import { auth } from "./firebaseConfig.js"; // <-- Import Firebase
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginPage({ onShowCreateAccount }) {
    // We now use email, not username, to log in
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // Firebase login
            await signInWithEmailAndPassword(auth, email, password);
            // App.jsx's onAuthStateChanged will handle the rest
        } catch (firebaseError) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-120px)] rounded-xl overflow-hidden shadow-2xl mt-8">
            {/* Left Panel: Welcome Back! */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-8 flex flex-col justify-center items-center text-white text-center">
                {/* ... (content) ... */}
                <button
                    onClick={onShowCreateAccount}
                    className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors"
                >
                    CREATE ACCOUNT
                </button>
            </div>

            {/* Right Panel: Login Form */}
            <div className="md:w-1/2 bg-white text-gray-900 p-8 flex flex-col justify-center items-center">
                <h2 className="text-3xl font-bold mb-8">Login to Mathemix</h2>
                {/* ... (social buttons) ... */}
                <p className="text-gray-500 mb-6">or use your email for login:</p>

                <form onSubmit={handleLoginSubmit} className="w-full max-w-sm">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="sr-only" htmlFor="email">
                            Email
                        </label>
                        <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                {/* ... (email icon) ... */}
              </span>
                            <input
                                type="email"
                                id="email"
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
                        <label className="sr-only" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                {/* ... (password icon) ... */}
              </span>
                            <input
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition-colors"
                    >
                        SIGN IN
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;