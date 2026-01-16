import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Clock, Globe } from 'lucide-react';

export default function ShippingInfo() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black text-center mb-4">Shipping Information</h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
                    Everything you need to know about our shipping process
                </p>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <Package className="w-10 h-10 text-[var(--color-pink)]" />
                            <h2 className="text-2xl font-black">Processing Time</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Orders are processed within 1-2 business days. You'll receive a confirmation email once your order ships with tracking information.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <Truck className="w-10 h-10 text-[var(--color-purple)]" />
                            <h2 className="text-2xl font-black">Shipping Methods</h2>
                        </div>
                        <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                            <li className="flex justify-between">
                                <span className="font-bold">Standard Shipping:</span>
                                <span>5-7 business days - FREE over $50</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-bold">Express Shipping:</span>
                                <span>2-3 business days - $15</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="font-bold">Overnight:</span>
                                <span>1 business day - $30</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <Globe className="w-10 h-10 text-[var(--color-orange)]" />
                            <h2 className="text-2xl font-black">International Shipping</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We ship worldwide! International orders typically arrive within 10-20 business days. Customs fees may apply based on your country's regulations.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <Clock className="w-10 h-10 text-[var(--color-teal)]" />
                            <h2 className="text-2xl font-black">Tracking Your Order</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Once shipped, you'll receive a tracking number via email. Use this to monitor your package's journey to your doorstep!
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}