import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '../utils';
import { base44 } from '../api/base44Client';
import { Button } from '../components/ui/button';


import ProductCard from '../components/ProductCard';

const CLOWN_MASCOT_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/689ae265af9a727524928c44/9ab406010_joker.png";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loadedCount, setLoadedCount] = useState(12);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const [userFavorites, setUserFavorites] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await base44.entities.Product.filter({ isMysteryBoxCandidate: false }, '-created_date', 52);
        setProducts(data);
        setDisplayedProducts(data.slice(0, 12));
        
        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);
            const favorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
            setUserFavorites(favorites);
        } catch (error) {
            // User not logged in
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 600) {
                if (loadedCount < products.length && !isLoadingMore) {
                    setIsLoadingMore(true);
                    const nextCount = Math.min(loadedCount + 8, products.length);
                    setDisplayedProducts(products.slice(0, nextCount));
                    setLoadedCount(nextCount);
                    setTimeout(() => setIsLoadingMore(false), 500);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [products, loadedCount, isLoadingMore]);

    return (
        <div className="space-y-24">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
                <motion.img
                    src={CLOWN_MASCOT_URL}
                    alt="BagiLand Clown Mascot"
                    className="w-48 h-48 mx-auto mb-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                />
                <motion.h1 
                    className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-[var(--color-pink)] via-[var(--color-orange)] to-[var(--color-yellow)] bg-clip-text text-transparent leading-tight pb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Welcome to BagiLand!
                </motion.h1>
                <motion.p 
                    className="text-xl md:text-2xl text-dark/80 dark:text-off-white/80 max-w-2xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Hand-picked weird & wonderful finds from around the web.
                </motion.p>
                <motion.div 
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to={createPageUrl('Categories')}>
                        <Button size="lg" className="text-lg font-bold rounded-full px-8 py-6 bg-[var(--color-purple)] hover:bg-purple-700 w-full sm:w-auto">Explore the Fun</Button>
                    </Link>
                    <Link to={createPageUrl('MysteryBox')}>
                        <Button size="lg" variant="outline" className="text-lg font-bold rounded-full px-8 py-6 border-4 border-[var(--color-teal)] hover:bg-teal-500/10 text-[var(--color-teal)] w-full sm:w-auto">Spin the Wheel</Button>
                    </Link>
                </motion.div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-black text-center mb-8 leading-tight pb-2">Featured Finds</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {displayedProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} userFavorites={userFavorites} user={user} />
                    ))}
                </div>

                {loadedCount >= products.length && products.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">You've seen all products! 🎉</p>
                    </div>
                )}
            </section>
        </div>
    );
}