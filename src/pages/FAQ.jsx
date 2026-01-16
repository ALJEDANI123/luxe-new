import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order ships, you'll receive an email with a tracking number. Click the link in the email or enter the tracking number on our shipping carrier's website."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Yes! We ship worldwide. International shipping typically takes 10-20 business days. Please note that customs fees may apply based on your country."
        },
        {
            question: "How long do I have to return an item?",
            answer: "We offer a 30-day return policy on most items. Products must be unused and in their original packaging."
        },
        {
            question: "Are the products authentic?",
            answer: "All products featured on BagiLand are sourced from reputable marketplaces like Amazon and eBay. We link directly to these trusted sellers."
        },
        {
            question: "What is the Mystery Box?",
            answer: "The Mystery Box is a fun feature where you can spin to discover random quirky products! It's a great way to find unique items you might not have searched for."
        },
        {
            question: "How does the affiliate program work?",
            answer: "BagiLand is an affiliate site. When you click on a product and make a purchase through Amazon or eBay, we may earn a small commission at no extra cost to you."
        },
        {
            question: "Can I cancel my order?",
            answer: "Orders can be cancelled within 24 hours of placement by contacting our support team. After processing begins, cancellation may not be possible."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black text-center mb-4">Frequently Asked Questions</h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
                    Got questions? We've got answers!
                </p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <span className="font-black text-lg pr-4">{faq.question}</span>
                                <ChevronDown 
                                    className={`w-6 h-6 text-[var(--color-purple)] transition-transform flex-shrink-0 ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-8 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}