import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Heart } from 'lucide-react';

const CLOWN_MASCOT_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/9ab406010_joker.png";

// Colorful illustrated carnival background
const CARNIVAL_BG = "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1400&q=90";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-4">

                {/* Card 1 - Big hero card with illustrated carnival background */}
                <motion.div
                    className="relative rounded-3xl overflow-hidden shadow-2xl"
                    style={{ minHeight: '320px' }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Illustrated colorful background */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 30%, #0d4a2a 60%, #1a2a0a 100%)'
                    }} />
                    {/* Colorful carnival illustration overlay */}
                    <div className="absolute inset-0 opacity-70"
                        style={{
                            backgroundImage: `url(${CARNIVAL_BG})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center bottom'
                        }}
                    />
                    {/* Purple/dark overlay on left for text readability */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to right, rgba(20,0,40,0.85) 0%, rgba(20,0,40,0.6) 50%, rgba(20,0,40,0.1) 100%)'
                    }} />

                    {/* Sparkle decorations */}
                    <div className="absolute top-5 right-10 text-yellow-300 text-3xl animate-pulse">✦</div>
                    <div className="absolute top-14 right-28 text-pink-300 text-xl animate-pulse" style={{ animationDelay: '0.4s' }}>✦</div>
                    <div className="absolute top-8 right-48 text-white text-lg animate-pulse" style={{ animationDelay: '0.8s' }}>✦</div>
                    <div className="absolute bottom-10 right-20 text-yellow-200 text-2xl animate-pulse" style={{ animationDelay: '0.6s' }}>✦</div>
                    <div className="absolute bottom-6 right-60 text-purple-300 text-xl animate-pulse" style={{ animationDelay: '1.2s' }}>✦</div>

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-12 max-w-xl">
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                                <Sparkles className="w-8 h-8 text-yellow-300" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight"
                                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
                                    About BagiLand
                                </h1>
                                <p className="text-yellow-300 font-bold text-lg mt-1"
                                    style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
                                    The most wonderfully weird corner of the internet!
                                </p>
                            </div>
                        </div>
                        <p className="text-white/90 text-base leading-relaxed"
                            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
                            Welcome friend to BagiLand! A magical place where the wonders of an amusement park meet the mysteries of an enchanted forest.
                            We got tired of boring shopping so we created a place dedicated to the quirky ✨ the unusual and the downright fun.
                        </p>
                    </div>
                </motion.div>

                {/* Bottom two cards side by side */}
                <div className="grid md:grid-cols-2 gap-4">

                    {/* Card 2 - Our Mission (Purple/Blue gradient with rocket illustration feel) */}
                    <motion.div
                        className="relative rounded-3xl overflow-hidden shadow-xl"
                        style={{ minHeight: '230px' }}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(135deg, #4c1d95 0%, #2563eb 100%)'
                        }} />
                        {/* Decorative circles */}
                        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full" />
                        <div className="absolute -top-8 right-8 w-32 h-32 bg-white/10 rounded-full" />

                        <div className="relative z-10 p-7 flex gap-5 items-start h-full">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Rocket className="w-9 h-9 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-3">Our mission</h2>
                                <p className="text-white/85 text-sm leading-relaxed mb-2">
                                    Our mission is simple: to scour the deepest corners of the web to find products that make you giggle gasp
                                    or just say "Why does that exist?!"
                                </p>
                                <p className="text-white/85 text-sm">
                                    Every item you see here is hand-picked by our team of professional weirdos.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3 - Come on in (Orange/Red gradient) */}
                    <motion.div
                        className="relative rounded-3xl overflow-hidden shadow-xl"
                        style={{ minHeight: '230px' }}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="absolute inset-0" style={{
                            background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)'
                        }} />
                        {/* Decorative circles */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
                        <div className="absolute -top-8 left-8 w-32 h-32 bg-white/10 rounded-full" />

                        <div className="relative z-10 p-7 flex gap-5 items-start h-full">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <Heart className="w-9 h-9 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-3">Come on in</h2>
                                <p className="text-white/85 text-sm leading-relaxed mb-2">
                                    So come on in take a look around spin the Mystery Wheel and find something
                                    that brings a little bit of circus magic into your life.
                                </p>
                                <p className="text-white/85 text-sm font-bold">
                                    Happy exploring! 🎪
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}