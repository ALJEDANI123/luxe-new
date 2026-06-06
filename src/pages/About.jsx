import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Heart } from 'lucide-react';

const CLOWN_MASCOT_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/9ab406010_joker.png";

export default function About() {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{
            background: 'linear-gradient(135deg, #fce4f3 0%, #e8e4f8 40%, #fdf3e0 100%)'
        }}>
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.img
                        src={CLOWN_MASCOT_URL}
                        alt="BagiLand Mascot"
                        className="w-24 h-24 mx-auto mb-6 object-contain"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.h1
                        className="text-5xl md:text-6xl font-black mb-3"
                        style={{ background: 'linear-gradient(to right, #d63384, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        About BagiLand
                    </motion.h1>
                    <motion.p
                        className="text-xl font-bold text-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        The most wonderfully weird corner of the internet!
                    </motion.p>
                </div>

                {/* Three Cards */}
                <div className="grid md:grid-cols-3 gap-6">

                    {/* Card 1 - Welcome */}
                    <motion.div
                        className="bg-white rounded-3xl p-7 shadow-lg text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ y: -4, shadow: 'xl' }}
                    >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                            style={{ background: 'linear-gradient(135deg, #f43f8f, #a855f7)' }}>
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            Welcome friend to BagiLand! A magical place where the wonders of an amusement park meet the mysteries of an enchanted forest.
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            We got tired of boring shopping so we created a place dedicated to the quirky the unusual and the downright fun.
                        </p>
                    </motion.div>

                    {/* Card 2 - Our Mission */}
                    <motion.div
                        className="bg-white rounded-3xl p-7 shadow-lg text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ y: -4 }}
                    >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                            style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
                            <Rocket className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            Our mission is simple: to scour the deepest corners of the web (mostly Amazon let's be honest) to find products that make you giggle gasp or just say "Why does that exist?!".
                        </p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Every item you see here is hand-picked by our team of professional weirdos.
                        </p>
                    </motion.div>

                    {/* Card 3 - Come on in */}
                    <motion.div
                        className="bg-white rounded-3xl p-7 shadow-lg text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        whileHover={{ y: -4 }}
                    >
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                            style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }}>
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            So come on in take a look around spin the Mystery Wheel and find something that brings a little bit of circus magic into your life.
                        </p>
                        <p className="text-gray-700 text-sm font-semibold">
                            Happy exploring!
                        </p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}