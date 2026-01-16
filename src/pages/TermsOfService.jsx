import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="prose prose-lg dark:prose-invert max-w-none"
            >
                <h1 className="text-5xl font-black mb-4">Terms of Service</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Last updated: January 1, 2026</p>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg space-y-6">
                    <section>
                        <h2 className="text-2xl font-black mb-3">Acceptance of Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            By accessing and using BagiLand, you accept and agree to be bound by these Terms of Service and our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Use of Service</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            You agree to use BagiLand only for lawful purposes. You must not:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>Use the service in any way that violates applicable laws</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                            <li>Use automated systems to access the site without permission</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Affiliate Disclosure</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            BagiLand is an affiliate marketing website. We may earn commissions from purchases made through links on our site at no additional cost to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Product Information</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We strive to provide accurate product information. However, we do not guarantee the accuracy, completeness, or reliability of any product descriptions or pricing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Intellectual Property</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            All content on BagiLand, including text, graphics, logos, and images, is the property of BagiLand or its content suppliers and is protected by copyright laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Limitation of Liability</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            BagiLand shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Changes to Terms</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3">Contact Information</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            For questions about these Terms of Service, please contact us at legal@bagiland.com.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}