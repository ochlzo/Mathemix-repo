// src/pages/ModeSelect.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Users, Trophy, Zap, Target, LogOut, Sparkles, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModeSelect({ username, onLogout }) {
    const navigate = useNavigate();
    const [hoveredMode, setHoveredMode] = useState(null);

    const stats = [
        { icon: Trophy, label: 'Games Won', value: '12', color: 'from-yellow-400 to-orange-500' },
        { icon: Target, label: 'Accuracy', value: '94%', color: 'from-green-400 to-emerald-500' },
        { icon: Zap, label: 'Streak', value: '5', color: 'from-purple-400 to-pink-500' },
    ];

    const mathSymbols = ['+', '−', '×', '÷', '=', 'π', '∑', '√', '∞'];

    return (
        // FIX 1: Changed 'min-h-screen' to 'h-screen'. Added 'overflow-hidden' to cut off any excess.
        <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#023e8a] via-[#0077b6] to-[#0096c7]">

            {/* --- HEADER --- */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <h1 className="text-3xl font-black text-white tracking-wider flex items-center gap-2">
                    Mathemix <span className="text-2xl">🧮</span>
                </h1>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-transform transform hover:scale-105"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* --- Animated background elements --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {mathSymbols.map((symbol, i) => (
                    <motion.div
                        key={`symbol-${i}`}
                        className="absolute text-white/10 select-none"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            fontSize: `${Math.random() * 80 + 60}px`,
                        }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {symbol}
                    </motion.div>
                ))}
            </div>

            {/* Dot pattern overlay */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* --- Main content --- */}
            {/* FIX 2: Removed 'pt-20 pb-10'. Used 'h-full' to fill the parent exactly. */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">

                <div className="w-full max-w-4xl">

                    {/* Welcome Section */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-10"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full border-2 border-white/30 mb-3"
                        >
                            <User className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-bold">Hello, {username || "Player"}!</span>
                        </motion.div>

                        <h2 className="text-white text-5xl mb-4 font-black leading-tight">
                            Ready to Challenge Your
                            <br />
                            <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent font-black">
                  Math Skills?
                </span>
                <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-3 bg-yellow-300/30 -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
                        </h2>
                        <p className="text-white/90 text-xl font-semibold">Select a game mode to start your adventure</p>
                    </motion.div>

                    {/* Game Mode Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">

                        {/* Solo Mode Button */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onMouseEnter={() => setHoveredMode('solo')}
                            onMouseLeave={() => setHoveredMode(null)}
                        >
                            <motion.button
                                onClick={() => navigate('/game')}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#023e8a] to-[#0077b6] border-4 border-white/20 shadow-2xl group text-left h-full"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/30"
                                    animate={{ opacity: hoveredMode === 'solo' ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />

                                <div className="relative z-10">
                                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-all shadow-inner">
                                        <Brain className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-white text-3xl mb-3 font-black">Solo Mode</h3>
                                    <p className="text-white/90 mb-0 font-medium text-base">Challenge yourself and improve your skills at your own pace.</p>

                                    <motion.div
                                        className="absolute top-4 right-4 text-white/10"
                                        animate={{ rotate: hoveredMode === 'solo' ? 360 : 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <User size={64} />
                                    </motion.div>
                                </div>
                            </motion.button>
                        </motion.div>

                        {/* Multiplayer Mode Button */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            onMouseEnter={() => setHoveredMode('multi')}
                            onMouseLeave={() => setHoveredMode(null)}
                        >
                            <motion.button
                                onClick={() => navigate('/lobby')}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-green-600 to-emerald-600 border-4 border-white/20 shadow-2xl group text-left h-full"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-400/30"
                                    animate={{ opacity: hoveredMode === 'multi' ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />

                                <div className="relative z-10">
                                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-all shadow-inner">
                                        <Users className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-white text-3xl mb-3 font-black">Multiplayer Mode</h3>
                                    <p className="text-white/90 mb-0 font-medium text-base">Compete with friends in real-time and climb the leaderboard.</p>

                                    <motion.div
                                        className="absolute top-4 right-4 text-white/10"
                                        animate={{ rotate: hoveredMode === 'multi' ? 360 : 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Users size={64} />
                                    </motion.div>
                                </div>
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-3 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/20 text-center"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-white text-2xl font-black">{stat.value}</div>
                                <div className="text-white/70 text-xs font-bold uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-4 w-full text-center text-white/40 text-xs font-semibold"
            >
                <p>Choose wisely and may the best mathematician win! 🎯</p>
            </motion.div>
        </div>
    );
}