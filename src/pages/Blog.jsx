import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { base44 } from '../api/base44Client';
import { createPageUrl } from '../utils';
import { BookOpen, Calendar, Tag, Search } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = posts.filter(post => 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(posts);
        }
    }, [searchQuery, posts]);

    const loadPosts = async () => {
        setIsLoading(true);
        const data = await base44.entities.Post.list('-publishedAt', 50);
        setPosts(data);
        setFilteredPosts(data);
        setIsLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-6"
                >
                    <BookOpen className="w-10 h-10 text-white" />
                </motion.div>
                <motion.h1 
                    className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-[var(--color-orange)] via-[var(--color-yellow)] to-[var(--color-teal)] bg-clip-text text-transparent leading-tight pb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    BagiLand Blog
                </motion.h1>
                <motion.p 
                    className="text-xl text-dark/70 dark:text-off-white/70 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    اكتشف أحدث المقالات والقصص المثيرة من عالم المنتجات الغريبة
                </motion.p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="ابحث في المقالات..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 rounded-full text-lg"
                    />
                </div>
            </div>

            {/* Posts Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                            <Link to={createPageUrl('BlogPost') + '?id=' + post.id}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full group">
                                    {post.coverImage && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img 
                                                src={post.coverImage} 
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold mb-3 group-hover:text-[var(--color-pink)] transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        {post.publishedAt && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(post.publishedAt).toLocaleDateString('ar-SA')}
                                            </div>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                                                        <Tag className="w-3 h-3" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <Button className="w-full bg-gradient-to-r from-[var(--color-pink)] to-[var(--color-purple)] hover:opacity-90 rounded-full">
                                            اقرأ المزيد
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-2xl text-gray-500">لا توجد مقالات حالياً</p>
                </div>
            )}
        </div>
    );
}