import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, TrendingUp } from 'lucide-react';
import { Product } from '@/entities/Product';
import { formatPrice } from '@/components/utils/helpers';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function SearchModal({ isOpen, onClose }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setIsSearching(true);
            const products = await Product.list();
            const filtered = products.filter(p => 
                p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 6));
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border-4 border-white/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/30 to-purple-400/30 rounded-full filter blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-yellow-400/30 to-orange-400/30 rounded-full filter blur-3xl -z-10"></div>

                    {/* Header with gradient */}
                    <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                        >
                            <X className="w-6 h-6 text-white" />
                        </motion.button>
                        
                        <div className="flex items-center gap-3 mb-2">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-8 h-8 text-yellow-300" />
                            </motion.div>
                            <h2 className="text-3xl font-black text-white">Search BagiLand</h2>
                        </div>
                        <p className="text-white/90 text-sm ml-11">Find your next weird & wonderful treasure!</p>
                    </div>

                    {/* Search Input */}
                    <div className="p-6">
                        <motion.div 
                            className="relative"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <Search className="w-6 h-6 text-purple-500" />
                                {isSearching && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"
                                    />
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Search for quirky products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-6 py-5 text-lg bg-white dark:bg-gray-800 rounded-2xl outline-none text-gray-900 dark:text-white shadow-lg border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400 transition-all placeholder:text-gray-400"
                                autoFocus
                            />
                        </motion.div>

                        {/* Search Results */}
                        <div className="mt-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {!searchQuery && (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center py-12"
                                    >
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        >
                                            <TrendingUp className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                                        </motion.div>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                                            Start typing to discover amazing products!
                                        </p>
                                    </motion.div>
                                )}

                                {searchQuery && searchResults.length === 0 && !isSearching && (
                                    <motion.div
                                        key="no-results"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="text-center py-12"
                                    >
                                        <div className="text-6xl mb-4">🤷</div>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">
                                            No products found for "<span className="text-purple-600 dark:text-purple-400">{searchQuery}</span>"
                                        </p>
                                    </motion.div>
                                )}

                                {searchResults.length > 0 && (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-3"
                                    >
                                        {searchResults.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    to={createPageUrl('Product') + '?id=' + product.id}
                                                    onClick={onClose}
                                                    className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 rounded-2xl transition-all border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 shadow-sm hover:shadow-lg"
                                                >
                                                    <motion.img
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        src={product.images?.[0] || 'https://via.placeholder.com/80'}
                                                        alt={product.title}
                                                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                                                    />
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                            {product.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                            {product.subtitle}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <p className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                                {formatPrice(product.price)}
                                                            </p>
                                                            {product.oldPrice && (
                                                                <p className="text-sm line-through text-gray-400">
                                                                    {formatPrice(product.oldPrice)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.div
                                                        initial={{ x: -10, opacity: 0 }}
                                                        whileHover={{ x: 0, opacity: 1 }}
                                                        className="text-purple-600 dark:text-purple-400"
                                                    >
                                                        →
                                                    </motion.div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #a855f7, #ec4899);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #9333ea, #db2777);
                }
            `}</style>
        </AnimatePresence>
    );
}