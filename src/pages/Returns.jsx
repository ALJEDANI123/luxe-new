import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export default function Returns() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black text-center mb-4">Returns & Exchanges</h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
                    Not happy with your quirky find? No worries!
                </p>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <RotateCcw className="w-10 h-10 text-[var(--color-pink)]" />
                            <h2 className="text-2xl font-black">Our Return Policy</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            We offer a 30-day return policy on most items. Products must be unused, in original packaging, and in the same condition you received them.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            To initiate a return, please contact our customer service team at support@bagiland.com with your order number and reason for return.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                            <h2 className="text-2xl font-black">Eligible for Return</h2>
                        </div>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li>✅ Unused items in original packaging</li>
                            <li>✅ Defective or damaged products</li>
                            <li>✅ Wrong item received</li>
                            <li>✅ Items returned within 30 days of delivery</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <XCircle className="w-10 h-10 text-red-500" />
                            <h2 className="text-2xl font-black">Non-Returnable Items</h2>
                        </div>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                            <li>❌ Opened or used items</li>
                            <li>❌ Items without original packaging</li>
                            <li>❌ Personalized or custom products</li>
                            <li>❌ Digital downloads</li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8">
                        <h2 className="text-2xl font-black mb-4">Refund Processing</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Once we receive and inspect your return, we'll process your refund within 5-7 business days. The refund will be credited to your original payment method.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}