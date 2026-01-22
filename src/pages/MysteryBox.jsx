import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../api/base44Client';
import { Button } from '../components/ui/button';

import ProductCard from '../components/ProductCard';
import { Confetti } from '../components/Confetti';

export default function MysteryBox() {
    const [candidates, setCandidates] = useState([]);
    const [result, setResult] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [userFavorites, setUserFavorites] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        base44.entities.Product.filter({ isMysteryBoxCandidate: true }).then(setCandidates);
        
        base44.auth.me().then(async (currentUser) => {
            setUser(currentUser);
            const favorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
            setUserFavorites(favorites);
        }).catch(() => {});
    }, []);

    const handleSpin = () => {
        if (candidates.length === 0) return;
        setIsSpinning(true);
        setResult(null);
        setShowConfetti(false);

        const spinDuration = 3000;
        const intervalTime = 100;
        let spinInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            setResult(candidates[randomIndex]);
        }, intervalTime);

        setTimeout(() => {
            clearInterval(spinInterval);
            const finalIndex = Math.floor(Math.random() * candidates.length);
            setResult(candidates[finalIndex]);
            setIsSpinning(false);
            setShowConfetti(true);
        }, spinDuration);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            {showConfetti && <Confetti />}
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[var(--color-pink)] via-[var(--color-purple)] to-[var(--color-blue)] bg-clip-text text-transparent leading-tight pb-2">Mystery Box</h1>
            <p className="text-xl mb-8">Spin the wheel to discover a random quirky product!</p>

            <Button onClick={handleSpin} disabled={isSpinning || candidates.length === 0} size="lg" className="text-2xl font-bold rounded-full px-12 py-8 bg-[var(--color-orange)] hover:bg-orange-600 mb-12">
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </Button>
            
            <div className="h-96 flex items-center justify-center">
                {result && (
                    <motion.div
                        key={result.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring' }}
                        className="max-w-xs"
                    >
                        <ProductCard product={result} userFavorites={userFavorites} user={user} />
                    </motion.div>
                )}
                 {!result && !isSpinning && (
                    <p className="text-2xl text-gray-500">Ready to find some treasure?</p>
                 )}
            </div>
        </div>
    );
}