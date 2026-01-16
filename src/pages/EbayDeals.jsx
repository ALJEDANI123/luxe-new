import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../api/base44Client';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EbayDeals() {
    const [products, setProducts] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const allProducts = await base44.entities.Product.list();
            const ebayProducts = allProducts.filter(p => p.marketplace === 'eBay');
            setProducts(ebayProducts);
            
            try {
                const currentUser = await base44.auth.me();
                setUser(currentUser);
                const favorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
                setUserFavorites(favorites);
            } catch (error) {
                // User not logged in
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-[var(--color-purple)] via-[var(--color-pink)] to-[var(--color-orange)] bg-clip-text text-transparent leading-tight pb-2">
                    eBay Exclusive Deals
                </h1>
                <p className="text-xl text-dark/70 dark:text-off-white/70 max-w-2xl mx-auto">
                    Discover amazing finds from eBay's marketplace
                </p>
            </motion.div>

            {isLoading ? (
                <LoadingSpinner />
            ) : products.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-2xl text-gray-500">No eBay products available yet!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <ProductCard product={product} userFavorites={userFavorites} user={user} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}