import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../api/base44Client';
import { Sparkles, PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function QuirkyFinds() {
    const [products, setProducts] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const data = await base44.entities.Product.filter({ isMysteryBoxCandidate: true }, '-created_date', 20);
        setProducts(data);
        
        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);
            const favorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
            setUserFavorites(favorites);
        } catch (error) {
            // User not logged in
        }
        setIsLoading(false);
    };

    const handleAddNewQuirkyFind = () => {
        navigate(createPageUrl('Admin'));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6"
                >
                    <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h1 
                    className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-[var(--color-pink)] via-[var(--color-purple)] to-[var(--color-blue)] bg-clip-text text-transparent leading-tight pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Quirky Finds
                </motion.h1>
                <motion.p 
                    className="text-xl text-dark/70 dark:text-off-white/70 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Discover our curated collection of weird, wonderful, and wildly unique products from around the web
                </motion.p>
            </div>

            {/* Add New Quirky Find Button (Admin Only) */}
            {user && user.role === 'admin' && (
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button 
                        onClick={handleAddNewQuirkyFind}
                        className="bg-gradient-to-r from-[var(--color-teal)] to-[var(--color-blue)] hover:from-[var(--color-teal)] hover:to-[var(--color-blue)] text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add New Quirky Find
                    </Button>
                </motion.div>
            )}

            {/* Products Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                            <ProductCard product={product} userFavorites={userFavorites} user={user} />
                        </motion.div>
                    ))}
                </div>
            )}

            {!isLoading && products.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-2xl text-gray-500">No products available at the moment</p>
                </div>
            )}
        </div>
    );
}