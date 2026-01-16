import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '../api/base44Client';

import ProductCard from '../components/ProductCard';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [userFavorites, setUserFavorites] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        base44.entities.Category.list().then(setCategories);
        base44.entities.Product.list().then(setProducts);
        
        base44.auth.me().then(async (currentUser) => {
            setUser(currentUser);
            const favorites = await base44.entities.Favorite.filter({ user_email: currentUser.email });
            setUserFavorites(favorites);
        }).catch(() => {});
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory.id)
        : products;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-5xl font-black text-center mb-4 leading-tight pb-2">Categories</h1>
            <p className="text-xl text-center text-dark/70 dark:text-off-white/70 mb-12">Find your next favorite weird thing!</p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`font-bold py-2 px-4 rounded-full transition-colors ${!selectedCategory ? 'bg-[var(--color-purple)] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat)}
                        className={`font-bold py-2 px-4 rounded-full transition-colors ${selectedCategory?.id === cat.id ? 'bg-[var(--color-purple)] text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, i) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                    >
                        <ProductCard product={product} userFavorites={userFavorites} user={user} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}