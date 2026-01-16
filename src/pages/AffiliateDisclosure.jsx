import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Heart, Shield } from 'lucide-react';

export default function AffiliateDisclosure() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black text-center mb-4">Affiliate Disclosure</h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
                    Transparency is important to us
                </p>

                <div className="space-y-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <DollarSign className="w-10 h-10 text-[var(--color-teal)]" />
                            <h2 className="text-2xl font-black">How We Earn</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            BagiLand participates in various affiliate marketing programs, including Amazon Associates and eBay Partner Network. This means that when you click on product links and make a purchase, we may earn a small commission at no additional cost to you.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <Heart className="w-10 h-10 text-[var(--color-pink)]" />
                            <h2 className="text-2xl font-black">Our Promise</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            We only recommend products that we genuinely find interesting, quirky, or valuable. Our affiliate relationships do not influence our product selections or reviews.
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                            <li>We curate products based on uniqueness and quality</li>
                            <li>Commissions never affect the price you pay</li>
                            <li>We're transparent about all affiliate relationships</li>
                            <li>Your trust is more important than any commission</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <Shield className="w-10 h-10 text-[var(--color-purple)]" />
                            <h2 className="text-2xl font-black">Your Protection</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            All purchases are made directly through trusted retailers like Amazon and eBay. BagiLand does not handle payments or shipping. You're protected by the policies of the retailer you purchase from.
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8">
                        <h2 className="text-2xl font-black mb-4">Amazon Associates</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            "As an Amazon Associate, BagiLand earns from qualifying purchases. This means we may earn a commission when you purchase products through our Amazon links, at no extra cost to you."
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-black mb-4">Questions?</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            If you have any questions about our affiliate relationships or how we earn, please don't hesitate to contact us at affiliate@bagiland.com.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}