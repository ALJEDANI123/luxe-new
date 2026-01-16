import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="prose prose-lg dark:prose-invert max-w-none"
            >
                <h1 className="text-5xl font-black mb-4">Privacy Policy</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Last updated: January 1, 2026</p>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg space-y-6">
                    <section>
                        <h2 className="text-2xl font-black mb-3">Information We Collect</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We collect information you provide directly to us, including your name, email address, shipping address, and payment information when you make a purchase or create an account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">How We Use Your Information</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Process and fulfill your orders</li>
                            <li>Send you order confirmations and updates</li>
                            <li>Respond to your comments and questions</li>
                            <li>Send you marketing communications (with your consent)</li>
                            <li>Improve our website and services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Information Sharing</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our website and conducting our business.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Cookies</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Data Security</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Your Rights</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            You have the right to access, update, or delete your personal information. Contact us at privacy@bagiland.com to exercise these rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Contact Us</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at privacy@bagiland.com.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}