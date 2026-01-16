import React from 'react';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

export default function CookiePolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <Cookie className="w-20 h-20 mx-auto mb-4 text-[var(--color-orange)]" />
                    <h1 className="text-5xl font-black mb-4">Cookie Policy</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Last updated: January 1, 2026</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg space-y-6">
                    <section>
                        <h2 className="text-2xl font-black mb-3">What Are Cookies?</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Types of Cookies We Use</h2>
                        <div className="space-y-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                                <h3 className="font-black mb-2">Essential Cookies</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Required for the website to function properly. These cookies enable core functionality such as security and accessibility.
                                </p>
                            </div>
                            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
                                <h3 className="font-black mb-2">Analytics Cookies</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Help us understand how visitors interact with our website by collecting anonymous information.
                                </p>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                                <h3 className="font-black mb-2">Marketing Cookies</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Used to track visitors across websites to display relevant advertisements.
                                </p>
                            </div>
                            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                                <h3 className="font-black mb-2">Preference Cookies</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Remember your preferences such as language, region, and theme (light/dark mode).
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Managing Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            You can control and manage cookies in various ways:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Browser Settings: Most browsers allow you to refuse or accept cookies</li>
                            <li>Delete Cookies: You can delete all cookies stored on your device</li>
                            <li>Third-party Tools: Use privacy tools and extensions</li>
                        </ul>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                            Please note that blocking all cookies may impact your experience on our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you have questions about our use of cookies, please contact us at cookies@bagiland.com.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}