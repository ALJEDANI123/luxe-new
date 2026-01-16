import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactUs() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-black text-center mb-4">Contact Us</h1>
                <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-12">
                    Have questions? We'd love to hear from you!
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-[var(--color-pink)]" />
                        <h3 className="font-bold text-xl mb-2">Email</h3>
                        <p className="text-gray-600 dark:text-gray-400">support@bagiland.com</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                        <Phone className="w-12 h-12 mx-auto mb-4 text-[var(--color-purple)]" />
                        <h3 className="font-bold text-xl mb-2">Phone</h3>
                        <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-[var(--color-orange)]" />
                        <h3 className="font-bold text-xl mb-2">Address</h3>
                        <p className="text-gray-600 dark:text-gray-400">123 Quirky Street, Fun City</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-black mb-6">Send us a message</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block font-bold mb-2">Name</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block font-bold mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700" placeholder="your.email@example.com" />
                        </div>
                        <div>
                            <label className="block font-bold mb-2">Message</label>
                            <textarea rows="5" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700" placeholder="How can we help?"></textarea>
                        </div>
                        <Button className="w-full bg-[var(--color-pink)] hover:bg-pink-600 font-black text-lg py-6 rounded-full">
                            Send Message
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}