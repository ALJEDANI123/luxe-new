import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../api/base44Client';

import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);
            
            const userFavorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
            setFavorites(userFavorites);

            const productIds = userFavorites.map(f => f.product_id);
            const allProducts = await base44.entities.Product.list();
            const favoriteProducts = allProducts.filter(p => productIds.includes(p.id));
            setProducts(favoriteProducts);
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">Loading your favorites...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-black mb-4">Please Sign In</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                    You need to be signed in to view your favorites
                </p>
                <Button 
                    onClick={() => base44.auth.redirectToLogin()}
                    className="bg-[var(--color-purple)] hover:bg-purple-700 text-lg font-bold px-8 py-6 rounded-full"
                >
                    Sign In
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-5xl font-black text-center mb-4 leading-tight pb-2">My Favorites ❤️</h1>
            <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
                Your collection of quirky favorites
            </p>

            {products.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">💔</div>
                    <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start adding products you love to your favorites!
                    </p>
                    <Link to={createPageUrl('Shop')}>
                        <Button className="bg-[var(--color-pink)] hover:bg-pink-600">
                            Browse Products
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <ProductCard product={product} userFavorites={favorites} user={user} onFavoriteChange={loadFavorites} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}