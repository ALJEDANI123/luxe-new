import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '../api/base44Client';
import { createPageUrl } from '../utils';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (!postId) {
            navigate(createPageUrl('Blog'));
            return;
        }

        setIsLoading(true);
        const data = await base44.entities.Post.get(postId);
        setPost(data);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-96 animate-pulse"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">المقالة غير موجودة</h1>
                <Button onClick={() => navigate(createPageUrl('Blog'))}>
                    العودة إلى المدونة
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Button 
                variant="ghost" 
                onClick={() => navigate(createPageUrl('Blog'))}
                className="mb-8 hover:bg-purple-100 dark:hover:bg-purple-900"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة إلى المدونة
            </Button>

            <motion.article
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                dir="rtl"
            >
                {post.coverImage && (
                    <div className="relative h-96 overflow-hidden">
                        <img 
                            src={post.coverImage} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-[var(--color-purple)] via-[var(--color-pink)] to-[var(--color-orange)] bg-clip-text text-transparent leading-tight pb-2">
                        {post.title}
                    </h1>

                    {post.publishedAt && (
                        <div className="flex items-center gap-2 text-gray-500 mb-6">
                            <Calendar className="w-5 h-5" />
                            <span className="text-lg">
                                {new Date(post.publishedAt).toLocaleDateString('ar-SA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-8">
                            {post.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                                    <Tag className="w-4 h-4" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="prose prose-lg dark:prose-invert max-w-none text-right" dir="rtl">
                        <ReactMarkdown
                            components={{
                                h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                                h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                                h3: ({children}) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
                                p: ({children}) => <p className="mb-4 leading-relaxed text-lg">{children}</p>,
                                ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                                a: ({children, href}) => <a href={href} className="text-[var(--color-pink)] hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </motion.article>
        </div>
    );
}