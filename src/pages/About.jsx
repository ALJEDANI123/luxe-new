import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Heart } from 'lucide-react';

const CLOWN_MASCOT_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/9ab406010_joker.png";

const CARNIVAL_BG = "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&q=80";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-4">

                {/* Card 1 - Big top hero card */}
                <motion.div
                    className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[280px] flex items-center"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${CARNIVAL_BG})` }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 p-8 md:p-12 max-w-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/40">
                                <img src={CLOWN_MASCOT_URL} alt="mascot" className="w-12 h-12 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                                    About BagiLand
                                </h1>
                                <p className="text-white/90 font-bold text-lg mt-1 drop-shadow">
                                    The most wonderfully weird corner of the internet!
                                </p>
                            </div>
                        </div>
                        <p className="text-white/85 text-base leading-relaxed">
                            Welcome friend to BagiLand! A magical place where the wonders of an amusement park meet the mysteries of an enchanted forest.
                            We got tired of boring shopping so we created a place dedicated to the quirky ✨ the unusual and the downright fun.
                        </p>
                    </div>

                    {/* Decorative stars */}
                    <div className="absolute top-4 right-8 text-yellow-300 text-2xl animate-pulse">✦</div>
                    <div className="absolute top-12 right-24 text-pink-300 text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
                    <div className="absolute bottom-8 right-16 text-purple-300 text-xl animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                </motion.div>

                {/* Bottom two cards */}
                <div className="grid md:grid-cols-2 gap-4">

                    {/* Card 2 - Mission (purple) */}
                    <motion.div
                        className="relative rounded-3xl overflow-hidden shadow-xl min-h-[220px] flex items-center p-8"
                        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Decorative circle bg */}
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full" />
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />

                        <div className="relative z-10 flex gap-5 items-start">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Rocket className="w-9 h-9 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Our mission</h2>
                                <p className="text-white/85 text-sm leading-relaxed">
                                    Our mission is simple: to scour the deepest corners of the web to find products that make you giggle gasp
                                    or just say "Why does that exist?!"
                                </p>
                                <p className="text-white/85 text-sm mt-2">
                                    Every item you see here is hand-picked by our team of professional weirdos.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3 - Come on in (orange) */}
                    <motion.div
                        className="relative rounded-3xl overflow-hidden shadow-xl min-h-[220px] flex items-center p-8"
                        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' }}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        {/* Decorative circle bg */}
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/10 rounded-full" />

                        <div className="relative z-10 flex gap-5 items-start">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Heart className="w-9 h-9 text-white" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white mb-2">Come on in</h2>
                                <p className="text-white/85 text-sm leading-relaxed">
                                    So come on in take a look around spin the Mystery Wheel and find something
                                    that brings a little bit of circus magic into your life.
                                </p>
                                <p className="text-white/85 text-sm mt-2 font-bold">
                                    Happy exploring!
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}