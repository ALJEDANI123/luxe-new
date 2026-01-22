import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Heart } from 'lucide-react';

const CLOWN_MASCOT_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/9ab406010_joker.png";

export default function About() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-yellow-900/20"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-300/30 to-orange-300/30 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full filter blur-3xl"></div>
            
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div 
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <motion.img 
                        src={CLOWN_MASCOT_URL} 
                        alt="BagiLand Mascot" 
                        className="w-40 h-40 mx-auto mb-4 drop-shadow-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    />
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-teal)] to-[var(--color-yellow)] bg-clip-text text-transparent leading-tight pb-2">
                        About BagiLand
                    </h1>
                    <p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-200">
                        The most wonderfully weird corner of the internet!
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-pink-200 dark:border-pink-800 hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="flex justify-center mb-3">
                            <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-3 rounded-2xl">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                                Welcome friend to BagiLand! A magical place where the wonders of an amusement park meet the mysteries of an enchanted forest.
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                                We got tired of boring shopping so we created a place dedicated to the quirky the unusual and the downright fun.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-purple-200 dark:border-purple-800 hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <div className="flex justify-center mb-3">
                            <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-2xl">
                                <Rocket className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                                Our mission is simple: to scour the deepest corners of the web (mostly Amazon let's be honest) to find products that make you giggle gasp or just say "Why does that exist?!".
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                                Every item you see here is hand-picked by our team of professional weirdos.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border-2 border-orange-200 dark:border-orange-800 hover:scale-105 transition-transform duration-300"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <div className="flex justify-center mb-3">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-2xl">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                                So come on in take a look around spin the Mystery Wheel and find something that brings a little bit of circus magic into your life.
                            </p>
                            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                                Happy exploring!
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}